import { Search } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function FilterTextInput({ placeholder = 'Cerca sagre, città o piatti...' }) {
    const theme = useTheme();

    return (
        <View
            className="flex-row items-center gap-2 px-4 py-3 bg-white rounded-3xl"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 20,
                elevation: 12,
            }}
        >

            <Search color={theme.textSecondary} size={20} />
            <TextInput
                className="flex-1 text-xl"
                placeholder={placeholder}
                placeholderTextColor={theme.textSecondary}
                style={{ color: theme.text }}
            />
        </View>
    );
}

export default TextInput;
