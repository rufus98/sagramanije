import EventDetail from "@/components/sagra/event-detail";
import SagraInfo from "@/components/sagra/sagra-info";
import ErrorState from "@/components/ui/error-state";
import { Colors } from "@/constants/theme";
import { sagraService } from "@/services/sagra.service";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";

export default function SagraPage() {
    const { id, locandina, distanza } = useLocalSearchParams<{ id: string; locandina?: string; distanza?: string }>()
    const { data, isPending, isError, isFetching, refetch } = useQuery({
        queryKey: ["sagra", id],
        queryFn: ({ signal }) => sagraService.getById(id, signal),
        retry: false,
    })

    return (
        <EventDetail poster={data?.locandina ?? locandina} actions={data && data.lat ? {
            destination: data,
            share: {
                title: data.nome_sagra,
                message: `Scopri la sagra "${data.nome_sagra}"!`,
                url: `https://sagramanije.it/sagra/${data.id}`,
            },
        } : undefined}>
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
        </EventDetail>
    )
}
