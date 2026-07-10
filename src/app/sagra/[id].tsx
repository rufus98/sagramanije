import { ThemedView } from "@/components/themed-view";
import BackButton from "@/components/sagra/back-button";
import SagraHero from "@/components/sagra/sagra-hero";
import SagraInfo from "@/components/sagra/sagra-info";
import useUserLocation from "@/hooks/use-user-location";
import { sagraService } from "@/services/sagra.service";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapPin } from "lucide-react-native";
import { mapUtils } from "@/utils/map-utils";
import { Colors } from "@/constants/theme";

export default function SagraPage() {
    const { id, locandina } = useLocalSearchParams<{ id: string; locandina?: string }>()
    const { location } = useUserLocation()
    const insets = useSafeAreaInsets()
    const { data } = useQuery({
        queryKey: ["sagra", id],
        queryFn: async () => await sagraService.getById(id),
    })

    return (
        <View style={{ flex: 1 }}>
            <SagraHero source={data?.locandina ?? locandina} />
            <BackButton />
            <ThemedView className="rounded-3xl -mt-8 flex-1 px-5 py-6">
                <ScrollView>
                    <SagraInfo sagra={data} location={location} />
                </ScrollView>
            </ThemedView>

            {(data && data.lat) && <View className="bg-white px-3 pt-4 " style={{paddingBottom: insets.bottom}}>
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
