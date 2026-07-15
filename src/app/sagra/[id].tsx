import BackButton from "@/components/sagra/back-button";
import SagraHero from "@/components/sagra/sagra-hero";
import SagraInfo from "@/components/sagra/sagra-info";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { sagraService } from "@/services/sagra.service";
import { mapUtils } from "@/utils/map-utils";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { MapPin } from "lucide-react-native";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SagraPage() {
    const { id, locandina, distanza } = useLocalSearchParams<{ id: string; locandina?: string; distanza?: string }>()
    const insets = useSafeAreaInsets()
    const { data, isPending } = useQuery({
        queryKey: ["sagra", id],
        queryFn: async () => await sagraService.getById(id),
    })

    return (
        <View style={{ flex: 1 }}>
            <SagraHero source={data?.locandina ?? locandina} />
            <BackButton />
            <ThemedView className="rounded-3xl -mt-8 flex-1 px-5 py-6">
                {isPending ? 
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator color={Colors.primary} />
                    </View>
                :
                    <ScrollView>
                        <SagraInfo sagra={data} distanza={distanza ? Number(distanza) : undefined} />
                    </ScrollView>
                }
            </ThemedView>

            {(data && data.lat) && <View className="bg-white px-3 pt-4 mb-2" style={{paddingBottom: insets.bottom}}>
                <TouchableOpacity onPress={() => mapUtils.openDirections(data)} className="w-2/3 m-auto py-5 bg-primary rounded-3xl flex flex-row gap-3 items-center justify-center"
                    style={{
                        shadowColor: Colors.primary,
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.12,
                        shadowRadius: 20,
                        elevation: 5,
                    }}
                >
                    <MapPin color={"#fff"} />
                    <ThemedText type="default" className="font-bold font-title" style={{color: "#fff"}}>Come arrivare</ThemedText>
                </TouchableOpacity>
            </View>}
        </View>
    )
}
