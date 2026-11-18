"""Export the approved branding PNGs at the requested Expo sizes (Pillow).

Run from any directory: python scripts/prepare-branding.py
Imagegen created the cutout and monochrome artwork; this only sizes/places it.

Autor: Felipe de Souza Aquino (PantanalDex)
"""
from pathlib import Path
from math import hypot
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/branding"
OUT = ROOT / "assets/images"
SIZE = 1024
BACKGROUND = "#0D0D0D"


def artwork(name):
    image = Image.open(SOURCE / name).convert("RGBA")
    # Ignore almost-transparent generation noise when measuring the artwork.
    alpha = image.getchannel("A")
    box = alpha.point(lambda value: 255 if value > 128 else 0).getbbox()
    if not box:
        raise ValueError(f"Empty artwork: {name}")
    return image.crop(box)


def centered(image, extent, safe_circle=False):
    width, height = image.size
    if safe_circle:
        # Android layers: 108dp; guaranteed safe circle: 66dp diameter.
        # Check actual alpha, not the square bounding box, to protect the ears.
        alpha = image.getchannel("A")
        radius = max(
            hypot(x + 0.5 - width / 2, y + 0.5 - height / 2)
            for y in range(height) for x in range(width)
            if alpha.getpixel((x, y)) > 128
        )
        scale = (extent / 2 - 2) / radius
    else:
        scale = extent / max(width, height)
    image = image.resize((round(width * scale), round(height * scale)), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (SIZE, SIZE))
    canvas.alpha_composite(image, ((SIZE - image.width) // 2, (SIZE - image.height) // 2))
    return canvas


head = artwork("onca-recorte.png")
mono = artwork("onca-monocromatica.png")
foreground = centered(head, SIZE * 66 / 108, safe_circle=True)
foreground.save(OUT / "android-icon-foreground.png", optimize=True)
centered(mono, SIZE * 66 / 108, safe_circle=True).save(OUT / "android-icon-monochrome.png", optimize=True)
Image.new("RGB", (SIZE, SIZE), BACKGROUND).save(OUT / "android-icon-background.png")
icon = Image.new("RGBA", (SIZE, SIZE), BACKGROUND)
icon.alpha_composite(centered(head, 840))
icon.convert("RGB").save(OUT / "icon.png", optimize=True)
icon.resize((64, 64), Image.Resampling.LANCZOS).convert("RGB").save(OUT / "favicon.png", optimize=True)
centered(head, 800).save(OUT / "splash-icon.png", optimize=True)
wordmark = Image.open(SOURCE / "pantanal-dex-logo-preto-amarelo-v2.png").convert("RGBA")
wordmark.resize((1200, round(wordmark.height * 1200 / wordmark.width)), Image.Resampling.LANCZOS).save(OUT / "logo-wordmark.png", optimize=True)
print("Exported 7 Expo branding assets.")
