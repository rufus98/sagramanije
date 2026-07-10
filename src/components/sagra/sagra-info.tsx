import { Coords } from "@/hooks/use-user-location";
import { Sagra } from "@/types/sagra";
import { View } from "react-native";
import { ThemedText } from "../themed-text";
import { calculateKmDistance, formatDistance } from "@/services/sagra.service";
import { Calendar } from "lucide-react-native";
import { Colors } from "@/constants/theme";
import DateFormatter from "../date-formatter";
import SagraMap from "./sagra-map";

// Riga informativa in cima al contenuto: categoria e distanza.
export default function SagraInfo({ sagra, location }: { sagra?: Sagra | null, location: Coords }) {

    const calculateDistance = () => {
        if(!location || !sagra?.lat || !sagra.leng) return ""
        const distance = calculateKmDistance(location?.lat, location?.lng, sagra?.lat, sagra?.leng)
        return formatDistance(distance)
    }
    return (
        <View>
            <View className="flex flex-row justify-between">
                <ThemedText themeColor="primary" type="smallBold">{sagra?.category.toUpperCase()}</ThemedText>
                {location && <ThemedText type="smallBold">{calculateDistance()}</ThemedText>}
            </View>
            <ThemedText type="subtitle" className="mt-4">{sagra?.nome_sagra}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">{sagra?.citta}, {sagra?.provincia}</ThemedText>

            <View className="flex flex-row justify-start gap-3 mt-5">
                <View className="rounded-3xl bg-white p-4 flex">
                    <Calendar color={Colors.primary} />
                    <ThemedText type="small" className="mt-4">QUANDO</ThemedText>
                    {sagra && <DateFormatter sagra={sagra} />}
                </View>
            </View>
            <View className="mt-5">
                <ThemedText className="font-title">La sagra</ThemedText>
                <ThemedText className="mt-3" type="code">Lorem ipsum</ThemedText>
            </View>
            {sagra && (
                <View className="mt-5">
                    <ThemedText className="font-title mb-3">Dove</ThemedText>
                    <SagraMap sagra={sagra} />
                </View>
            )}
        </View>
    )
}
