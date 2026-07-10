import { Children, Fragment, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { ThemedText } from '../themed-text';
import Separator from '../ui/separator';

import { Colors } from '@/constants/theme';

type ContactRowProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  /** Se presente, la riga diventa toccabile e mostra il chevron. */
  onPress?: () => void;
};

// Singola riga di contatto: icona + etichetta + valore (+ chevron se toccabile).
export function ContactRow({ icon: Icon, label, value, onPress }: ContactRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center gap-4 py-4"
    >
      <Icon color={Colors.primary} size={24} strokeWidth={1.75} />
      <View className="flex-1">
        <ThemedText type="small" themeColor="textSecondary">
          {label}
        </ThemedText>
        <ThemedText className="font-jakarta-bold text-lg">{value}</ThemedText>
      </View>
      {onPress && <ChevronRight color={Colors.textSecondary} size={22} />}
    </Pressable>
  );
}

// Contenitore che raggruppa le righe in una card con separatori.
export function ContactCard({ children }: { children: ReactNode }) {
  const rows = Children.toArray(children);
  return (
    <View className="rounded-3xl bg-white px-5">
      {rows.map((row, index) => (
        <Fragment key={index}>
          {index > 0 && <Separator />}
          {row}
        </Fragment>
      ))}
    </View>
  );
}
