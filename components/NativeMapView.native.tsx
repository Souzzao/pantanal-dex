import { useMemo } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import MapView, { Marker, type Region } from "react-native-maps";

import { useApp } from "@/contexts/AppContext";
import { species } from "@/shared/pantanal";

const roundCoordinate = (value: number) => Math.round(value * 100) / 100;

export default function NativeMapView() {
  const { sightings } = useApp();
  const located = sightings.filter((item) => item.latitude !== undefined && item.longitude !== undefined);
  const region = useMemo<Region>(() => {
    if (located.length === 0) return { latitude: -16.25, longitude: -56.65, latitudeDelta: 4.5, longitudeDelta: 4.5 };
    const latitude = located.reduce((sum, item) => sum + (item.latitude ?? 0), 0) / located.length;
    const longitude = located.reduce((sum, item) => sum + (item.longitude ?? 0), 0) / located.length;
    return { latitude, longitude, latitudeDelta: 1.8, longitudeDelta: 1.8 };
  }, [located]);

  return (
    <View style={{ height: 380, overflow: "hidden", borderBottomWidth: 1 }}>
      <MapView style={{ flex: 1 }} initialRegion={region}>
        {located.map((item) => {
          const latitude = item.latitude ?? 0;
          const longitude = item.longitude ?? 0;
          const isPrivateExact = item.visibility === "private" && item.locationPrecision === "exact";
          const coordinate = isPrivateExact ? { latitude, longitude } : { latitude: roundCoordinate(latitude), longitude: roundCoordinate(longitude) };
          const animal = species.find((entry) => entry.id === item.speciesId);
          return <Marker key={item.id} coordinate={coordinate} title={animal?.commonName ?? "Avistamento"} description={item.locationLabel ?? item.date} onCalloutPress={() => router.push({ pathname: "/sightings/[id]", params: { id: item.id } } as any)} />;
        })}
      </MapView>
    </View>
  );
}
