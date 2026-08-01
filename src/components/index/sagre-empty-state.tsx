import { Colors } from '@/constants/theme';
import { SearchX } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { ThemedText } from '../themed-text';

export default function SagreEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-8 pb-12">
      <View className="rounded-full bg-primary/15 p-5">
        <SearchX color={Colors.primary} size={34} strokeWidth={1.75} />
      </View>
      <ThemedText type="subtitle" className="mt-5 text-center">
        Nessuna sagra trovata
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" className="mt-2 text-center">
        Prova a cambiare periodo, distanza o parole della ricerca.
      </ThemedText>
      <Pressable
        onPress={onReset}
        accessibilityRole="button"
        className="mt-5 rounded-2xl bg-primary px-5 py-3 active:opacity-75"
      >
        <ThemedText type="smallBold" style={{ color: '#fff' }}>
          Azzera filtri
        </ThemedText>
      </Pressable>
    </View>
  );
}
