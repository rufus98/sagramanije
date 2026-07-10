import { Sagra } from "@/types/sagra";
import { Linking, Platform } from "react-native";

// apre l'app mappe nativa con le indicazioni verso la sagra
function openDirections(sagra: Sagra) {
    const { lat, leng } = sagra;
    const label = encodeURIComponent(sagra.nome_sagra);
    const url = Platform.select({
        ios: `http://maps.apple.com/?daddr=${lat},${leng}&q=${label}`,
        android: `google.navigation:q=${lat},${leng}`,
    })!;
    // fallback web se l'app nativa non è disponibile
    Linking.openURL(url).catch(() =>
        Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${lat},${leng}`
        )
    );
}

export const mapUtils = {openDirections}