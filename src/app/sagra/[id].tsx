import BackButton from "@/components/sagra/back-button";
import SagraHero from "@/components/sagra/sagra-hero";
import SagraInfo from "@/components/sagra/sagra-info";
import ShareButton from "@/components/sagra/share-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import ErrorState from "@/components/ui/error-state";
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
    const { data, isPending, isError, isFetching, refetch } = useQuery({
        queryKey: ["sagra", id],
        queryFn: ({ signal }) => sagraService.getById(id, signal),
        retry: false,
    })

    return (
        <View style={{ flex: 1 }}>
            <SagraHero source={data?.locandina ?? locandina} />
            <BackButton />
            <ThemedView className="rounded-3xl -mt-12 flex-1 pt-3">
                {isError ?
                    <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />
                : isPending ?
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator color={Colors.primary} />
                    </View>
                :
                    <ScrollView contentContainerClassName="px-5">
                        <SagraInfo sagra={data} distanza={distanza ? Number(distanza) : undefined} />
                    </ScrollView>
                }
            </ThemedView>

            {(data && data.lat) && <ThemedView className="px-4 pt-4 flex flex-row gap-3" style={{paddingBottom: Math.max(insets.bottom, 16)}}>
                <ShareButton sagra={data} />
                <TouchableOpacity onPress={() => mapUtils.openDirections(data)} className="flex-1 py-4 bg-primary rounded-3xl flex flex-row gap-3 items-center justify-center shadow-xl shadow-primary/20">
                    <MapPin color={"#fff"} />
                    <ThemedText type="default" className="font-bold font-title" style={{color: "#fff"}}>Come arrivare</ThemedText>
                </TouchableOpacity>
            </ThemedView>}
        </View>
    )
}
