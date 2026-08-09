import { Colors } from "@/constants/theme";
import { Sagra } from "@/types/sagra";
import { Calendar, ChevronRight, UtensilsCrossed } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import DateFormatter from "../date-formatter";
import { ThemedText } from "../themed-text";
import { useRouter } from "expo-router";

export default function SagraActionCards({ sagra }: { sagra?: Sagra | null }) {
    const router = useRouter()

    return (
        <View className="mt-5 flex flex-col gap-4">
            {/* Original Program Card with Dates */}
            {(sagra && sagra.ha_attivita === true) && (
                <TouchableOpacity 
                    onPress={() => router.push({ pathname: `/sagra/[id]/attivita`, params: { id: sagra.id, nome: sagra.nome_sagra } })} 
                    className="bg-white rounded-3xl flex flex-row items-center justify-between px-3 py-5 shadow-sm shadow-black/25"
                >
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
                </TouchableOpacity>
            )}

            {/* Menu Card */}
            {/* <TouchableOpacity 
                onPress={() => router.push({ pathname: `/sagra/[id]/menu`, params: { id: sagra?.id, nome: sagra?.nome_sagra } })} 
                className="bg-orange-50 rounded-3xl flex flex-row items-center justify-between px-3 py-5 border border-orange-100 shadow-sm shadow-black/10"
            >
                <View className="flex flex-row gap-3 items-center">
                    <View className="p-3 bg-orange-100 rounded-xl">
                        <UtensilsCrossed color="#EA580C" />
                    </View>
                    <View>
                        <ThemedText type="smallBold" style={{color: '#EA580C'}}>Novità</ThemedText>
                        <ThemedText type="subtitle">Menù gastronomico</ThemedText>
                    </View>
                </View>
                <ChevronRight color="#EA580C" />
            </TouchableOpacity> */}
        </View>
    )
}
