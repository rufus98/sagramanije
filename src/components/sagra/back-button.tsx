import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Dimensione totale del bottone: icona 22 + p-5 (20px per lato).
export const BACK_BUTTON_SIZE = 22 + 20 * 2;

// Offset condiviso del bottone indietro: 6% dell'altezza / 5% della larghezza,
// ma mai sopra la safe area (notch / Dynamic Island).
export function useBackButtonOffset() {
    const insets = useSafeAreaInsets();
    const { height, width } = useWindowDimensions();
    return { top: Math.max(height * 0.06, insets.top), left: width * 0.05 };
}

export default function BackButton({ backgroundColor = Colors.background }: { backgroundColor?: string }) {
    const router = useRouter()
    const { top, left } = useBackButtonOffset();

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
            return;
        }

        router.replace("/");
    };

    return (
        <TouchableOpacity
            onPress={handleBack}
            className="absolute z-10 p-5 rounded-3xl"
            style={{ backgroundColor, top, left }}
        >
            <ChevronLeft size={22} />
        </TouchableOpacity>
    )
}
