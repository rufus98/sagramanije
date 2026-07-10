import { Colors } from "@/constants/theme";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { TouchableOpacity } from "react-native";

// Bottone indietro flottante in alto a sinistra sull'immagine.
export default function BackButton() {
    const router = useRouter()

    return (
        <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-[6%] left-[5%] z-10 p-5 rounded-3xl"
            style={{ backgroundColor: Colors.background }}
        >
            <ChevronLeft size={22} />
        </TouchableOpacity>
    )
}
