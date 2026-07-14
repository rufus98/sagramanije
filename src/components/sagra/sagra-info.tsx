import { Colors } from "@/constants/theme";
import { formatDistance } from "@/services/sagra.service";
import { Sagra } from "@/types/sagra";
import { Calendar } from "lucide-react-native";
import { View } from "react-native";
import DateFormatter from "../date-formatter";
import { ThemedText } from "../themed-text";
import SagraMap from "./sagra-map";

// Riga informativa in cima al contenuto: categoria e distanza.
export default function SagraInfo({ sagra, distanza }: { sagra?: Sagra | null, distanza?: number }) {

    return (
        <View>
            <View className="flex flex-row justify-between">
                <ThemedText themeColor="primary" type="smallBold">{sagra?.category.toUpperCase()}</ThemedText>
                {distanza && <ThemedText type="smallBold">{formatDistance(distanza)}</ThemedText>}
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
            {sagra?.descrizione && <View className="mt-5">
                <ThemedText className="font-title">La sagra</ThemedText>
                <ThemedText className="mt-3" type="default" themeColor="textSecondary">{sagra?.descrizione}</ThemedText>
            </View>}
            {sagra && (
                <View className="mt-5">
                    <ThemedText className="font-title mb-3">Dove</ThemedText>
                    <SagraMap sagra={sagra} />
                </View>
            )}
        </View>
    )
}
