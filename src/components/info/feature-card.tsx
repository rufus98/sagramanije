import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { ThemedText } from '../themed-text';

type FeatureCardProps = {
  icon: LucideIcon;
  /** Colore dell'icona e tinta di sfondo del riquadro */
  color: string;
  title: string;
  description: string;
};

// Card informativa: riquadro icona colorato + titolo + descrizione.
export function FeatureCard({ icon: Icon, color, title, description }: FeatureCardProps) {
  return (
    <View className="flex-row items-center gap-4 rounded-3xl bg-white p-5">
      <View className="rounded-2xl p-4" style={{ backgroundColor: `${color}22` }}>
        <Icon color={color} size={26} strokeWidth={1.75} />
      </View>
      <View className="flex-1">
        <ThemedText className="font-title text-lg">{title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" className="mt-1">
          {description}
        </ThemedText>
      </View>
    </View>
  );
}
