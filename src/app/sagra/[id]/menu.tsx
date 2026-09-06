import BackButton, { BACK_BUTTON_SIZE, useBackButtonOffset } from "@/components/sagra/back-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { UtensilsCrossed } from "lucide-react-native";

export default function MenuScreen() {
    const { top, left } = useBackButtonOffset();
    const { id, nome } = useLocalSearchParams<{ id: string, nome: string }>()

    return (
        <ThemedView className="flex-1">
            <BackButton backgroundColor="white" />
            <View
                className="justify-center items-start"
                style={{ marginTop: top, marginLeft: left + BACK_BUTTON_SIZE + 12, minHeight: BACK_BUTTON_SIZE }}
            >
                <ThemedText type="title">Menù</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">{nome}</ThemedText>
            </View>

            <ScrollView className="flex-1 mt-5" contentContainerClassName="px-5 pb-20">
                <View className="bg-orange-50/40 p-5 rounded-3xl border border-orange-100 mb-8">
                    <View className="flex flex-row items-center gap-3 mb-5">
                        <View className="p-2 bg-orange-100 rounded-xl">
                            <UtensilsCrossed color="#EA580C" size={20} />
                        </View>
                        <ThemedText className="font-title text-xl" style={{color: '#EA580C'}}>Specialità gastronomiche</ThemedText>
                    </View>

                    {/* Categoria 1: Primi Piatti */}
                    <View className="mb-5">
                        <ThemedText type="defaultSemiBold" className="mb-3 text-lg" style={{color: '#C2410C'}}>Primi Piatti</ThemedText>
                        
                        <View className="flex flex-row justify-between items-center mb-3">
                            <View className="flex-1 pr-4">
                                <ThemedText type="defaultSemiBold">Gnocchi al sugo di castrato</ThemedText>
                                <ThemedText type="small" themeColor="textSecondary" className="mt-1">Fatti a mano, serviti con pecorino locale stagionato.</ThemedText>
                            </View>
                            <ThemedText type="defaultSemiBold" style={{color: Colors.primary}}>€ 8,00</ThemedText>
                        </View>
                        
                        <View className="flex flex-row justify-between items-center mb-1">
                            <View className="flex-1 pr-4">
                                <ThemedText type="defaultSemiBold">Fettuccine ai funghi porcini</ThemedText>
                                <ThemedText type="small" themeColor="textSecondary" className="mt-1">Pasta all'uovo fresca e porcini dei boschi limitrofi.</ThemedText>
                            </View>
                            <ThemedText type="defaultSemiBold" style={{color: Colors.primary}}>€ 9,00</ThemedText>
                        </View>
                    </View>

                    <View className="bg-orange-200/60 h-[1px] w-full mb-5" />

                    {/* Categoria 2: Secondi e Specialità */}
                    <View className="mb-3">
                        <ThemedText type="defaultSemiBold" className="mb-3 text-lg" style={{color: '#C2410C'}}>Specialità e Secondi</ThemedText>
                        
                        <View className="flex flex-row justify-between items-center mb-3">
                            <View className="flex-1 pr-4">
                                <ThemedText type="defaultSemiBold">Arrosticini di pecora (10 pz)</ThemedText>
                                <ThemedText type="small" themeColor="textSecondary" className="mt-1">Cotti alla brace su canalina, serviti caldissimi.</ThemedText>
                            </View>
                            <ThemedText type="defaultSemiBold" style={{color: Colors.primary}}>€ 10,00</ThemedText>
                        </View>
                        
                        <View className="flex flex-row justify-between items-center mb-1">
                            <View className="flex-1 pr-4">
                                <ThemedText type="defaultSemiBold">Salsiccia e patatine fritte</ThemedText>
                                <ThemedText type="small" themeColor="textSecondary" className="mt-1">Salsiccia artigianale cotta alla brace.</ThemedText>
                            </View>
                            <ThemedText type="defaultSemiBold" style={{color: Colors.primary}}>€ 7,50</ThemedText>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </ThemedView>
    )
}
