import { Colors } from '@/constants/theme';
import type { DateFilter as DateFilterValue } from '@/utils/sagra-filters';
import { CalendarDays, PartyPopper, UtensilsCrossed } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { ThemedText } from '../themed-text';

type DateFilterProps = {
  value: DateFilterValue;
  onChange: (value: DateFilterValue) => void;
};

const OPTIONS = [
  { value: 'all', label: 'Tutte', icon: UtensilsCrossed },
  { value: 'today', label: 'Oggi', icon: CalendarDays },
  { value: 'weekend', label: 'Weekend', icon: PartyPopper },
] as const;

export default function DateFilter({ value, onChange }: DateFilterProps) {
  return (
    <View className="flex-row gap-2">
      {OPTIONS.map(({ value: optionValue, label, icon: Icon }) => {
        const selected = value === optionValue;

        return (
          <Pressable
            key={optionValue}
            onPress={() => onChange(optionValue)}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            className={`flex-row items-center justify-center gap-2 rounded-2xl border px-4 py-3 active:opacity-75 ${
              selected ? 'border-primary bg-primary' : 'border-[#eadaca] bg-white'
            }`}
          >
            <Icon size={16} color={selected ? '#fff' : Colors.textSecondary} />
            <ThemedText
              type="smallBold"
              style={selected ? { color: '#fff' } : { color: Colors.textSecondary }}
            >
              {label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}
