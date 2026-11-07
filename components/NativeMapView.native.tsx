import { router } from "expo-router";
import { PantanalMap } from "./PantanalMap";
import { useApp } from "@/contexts/AppContext";
import { filterSpeciesCatalog } from "@/shared/catalog";
import { roundToPublicLocationGrid } from "@/shared/location";

export default function NativeMapView() {
  const { sightings } = useApp();
  const catalog = new Map(filterSpeciesCatalog().map(item => [item.id, item.commonName]));
  const points = sightings.filter(item => item.latitude !== undefined && item.longitude !== undefined).map(item => {
    const exact = item.visibility === "private" && item.locationPrecision === "exact";
    return { id: item.id, label: catalog.get(item.speciesId) ?? "Espécie não identificada", latitude: exact ? item.latitude! : roundToPublicLocationGrid(item.latitude!), longitude: exact ? item.longitude! : roundToPublicLocationGrid(item.longitude!) };
  });
  return <PantanalMap points={points} onOpenPoint={id => router.push({ pathname: "/sightings/[id]", params: { id } } as any)} />;
}
