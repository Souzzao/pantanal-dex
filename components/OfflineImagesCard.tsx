import { View } from 'react-native';
import { Text } from '@/components/Localized';
import { useColors } from '@/hooks/use-colors';
import { catalogCoverage } from '@/shared/catalog';
import metadata from '@/shared/species-photo-metadata.json';

/** Photos ship inside the APK, not in an evictable download cache. */
export function OfflineImagesCard() {
  const colors = useColors();
  return <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 22 }}>
    <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 17, fontWeight: '800' }}>Fotos incluídas no aplicativo</Text>
    <Text style={{ color: colors.muted, marginTop: 4 }}>{Object.keys(metadata).length}/{catalogCoverage.species} animais com fotografia disponível offline.</Text>
  </View>;
}
