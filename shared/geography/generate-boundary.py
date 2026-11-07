"""Extract Pantanal from the pinned public IBGE 2025 shapefile (stdlib only).

Usage: python shared/geography/generate-boundary.py path/to/ibge-biomas-2025.zip
The source ZIP is deliberately not stored in the app repository.
"""

import hashlib
import json
from pathlib import Path
import struct
import sys
import zipfile

SOURCE_SHA256 = "247b15c427070805044ebe02012f15552850d535fbfecaddb359875cdda1ea8f"
SOURCE_STEM = "lml_bioma_e250k_v20250911_A"


def extract(archive: Path) -> dict:
    if hashlib.sha256(archive.read_bytes()).hexdigest() != SOURCE_SHA256:
        raise ValueError("Source checksum differs from the pinned IBGE 2025 archive")
    with zipfile.ZipFile(archive) as bundle:
        dbf = bundle.read(SOURCE_STEM + ".dbf")
        shp = bundle.read(SOURCE_STEM + ".shp")
    count, header_length, record_length = struct.unpack_from("<IHH", dbf, 4)
    fields = []
    position = 32
    while dbf[position] != 13:
        descriptor = dbf[position:position + 32]
        fields.append((descriptor[:11].split(b"\0")[0].decode(), descriptor[16]))
        position += 32
    records = []
    for index in range(count):
        raw = dbf[header_length + index * record_length:header_length + (index + 1) * record_length]
        row = {}
        position = 1
        for field, length in fields:
            row[field] = raw[position:position + length].decode("utf-8").strip()
            position += length
        records.append(row)

    offset = 100
    index = 0
    while offset < len(shp):
        _, content_words = struct.unpack_from(">II", shp, offset)
        raw = shp[offset + 8:offset + 8 + content_words * 2]
        if records[index].get("CD_BIOMA") == "6" and records[index].get("NM_BIOMA") == "Pantanal":
            if struct.unpack_from("<I", raw)[0] != 5:
                raise ValueError("Expected shapefile Polygon geometry")
            part_count, point_count = struct.unpack_from("<II", raw, 36)
            starts = list(struct.unpack_from("<" + "I" * part_count, raw, 44))
            point_offset = 44 + 4 * part_count
            points = [[round(value, 6) for value in struct.unpack_from("<dd", raw, point_offset + item * 16)] for item in range(point_count)]
            rings = [points[start:end] for start, end in zip(starts, starts[1:] + [point_count])]
            if any(len(ring) < 4 or ring[0] != ring[-1] for ring in rings):
                raise ValueError("Expected closed polygon rings")
            return {
                "type": "Feature",
                "properties": {"CD_BIOMA": "6", "NM_BIOMA": "Pantanal", "source": "IBGE", "edition": 2025},
                "bbox": [min(point[0] for point in points), min(point[1] for point in points), max(point[0] for point in points), max(point[1] for point in points)],
                "geometry": {"type": "Polygon", "coordinates": rings},
            }
        offset += 8 + content_words * 2
        index += 1
    raise ValueError("Pantanal feature was not found")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    feature = extract(Path(sys.argv[1]))
    destination = Path(__file__).with_name("pantanal-ibge-2025.json")
    destination.write_text(json.dumps(feature, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8", newline="\n")
    print(f"{destination}: {destination.stat().st_size} bytes")
    print("SHA256:", hashlib.sha256(destination.read_bytes()).hexdigest())
