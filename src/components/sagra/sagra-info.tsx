import { Colors } from "@/constants/theme";
import { formatDistance } from "@/services/sagra.service";
import { Sagra } from "@/types/sagra";
import { Calendar, ChevronRight } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import DateFormatter from "../date-formatter";
import { ThemedText } from "../themed-text";
import SagraMap from "./sagra-map";
import { useRouter } from "expo-router";

// Riga informativa in cima al contenuto: categoria e distanza.
export default function SagraInfo({ sagra, distanza }: { sagra?: Sagra | null, distanza?: number }) {

    const router = useRouter()
    return (
        <View>
            <View className="flex flex-row justify-between">
                <ThemedText themeColor="primary" type="smallBold">{sagra?.category.toUpperCase()}</ThemedText>
                {distanza && <ThemedText type="smallBold">{formatDistance(distanza)}</ThemedText>}
            </View>
            <ThemedText type="subtitle" className="mt-4">{sagra?.nome_sagra}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">{sagra?.citta}, {sagra?.provincia}</ThemedText>

            {(sagra && sagra.ha_attivita === true) && <TouchableOpacity onPress={() => router.push({ pathname: `/sagra/[id]/attivita`, params: { id: sagra.id, nome: sagra.nome_sagra } })} className="bg-white rounded-3xl flex flex-row items-center justify-between px-3 py-5 mt-5 shadow-lg shadow-black/25">
                <View className="flex flex-row gap-3 items-center">
                    <View className="p-3 bg-primary/20 rounded-xl">
                        <Calendar color={Colors.primary} />
                    </View>
                    <View>
                        <DateFormatter sagra={sagra} />
                        <ThemedText type="subtitle">Programma completo</ThemedText>
                    </View>
                </View>
                <ChevronRight color={Colors.textSecondary} />
            </TouchableOpacity>}
            {sagra?.descrizione && <View className="mt-5">
                <ThemedText className="font-title">La sagra</ThemedText>
                <ThemedText className="mt-3" type="default" themeColor="textSecondary">{sagra?.descrizione}</ThemedText>
            </View>}
            {sagra && (
                <View className="my-5">
                    <ThemedText className="font-title mb-3">Dove</ThemedText>
                    <SagraMap sagra={sagra} />
                </View>
            )}
        </View>
    )
}
