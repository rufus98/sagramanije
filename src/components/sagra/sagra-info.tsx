import { formatDistance } from "@/services/sagra.service";
import { Sagra } from "@/types/sagra";
import { View } from "react-native";
import { ThemedText } from "../themed-text";
import SagraMap from "./sagra-map";
import SagraActionCards from "./sagra-action-cards";

// Riga informativa in cima al contenuto: categoria e distanza.
export default function SagraInfo({ sagra, distanza }: { sagra?: Sagra | null, distanza?: number }) {
    return (
        <View className="pb-8">
            <View className="flex flex-row justify-between">
                <ThemedText themeColor="primary" type="smallBold">{sagra?.category.toUpperCase()}</ThemedText>
                {distanza && <ThemedText type="smallBold">{formatDistance(distanza)}</ThemedText>}
            </View>
            <ThemedText type="subtitle" className="mt-4">{sagra?.nome_sagra}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">{sagra?.citta}, {sagra?.provincia}</ThemedText>

            <SagraActionCards sagra={sagra} />

            {sagra?.descrizione && <View className="mt-5">
                <ThemedText className="font-title">La sagra</ThemedText>
                <ThemedText className="mt-3" type="default" themeColor="textSecondary">{sagra?.descrizione}</ThemedText>
            </View>}

            {sagra && (
                <View className="my-5 mb-8">
                    <ThemedText className="font-title mb-3">Dove</ThemedText>
                    <SagraMap sagra={sagra} />
                </View>
            )}
        </View>
    )
}
