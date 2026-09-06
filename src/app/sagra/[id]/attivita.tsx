import AttivitaList from "@/components/attivita/attivita-list";
import BackButton, { BACK_BUTTON_SIZE, useBackButtonOffset } from "@/components/sagra/back-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import ErrorState from "@/components/ui/error-state";
import { Colors } from "@/constants/theme";
import { attivitaService } from "@/services/attivita.service";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Switch, View } from "react-native";

export default function Attivita() {
    const { top, left } = useBackButtonOffset();
    const { id, nome } = useLocalSearchParams<{ id: string, nome: string }>()
    const { data, isPending, isError, refetch, isFetching } = useQuery({
        queryKey: ['programma', id],
        queryFn: ({ signal }) => attivitaService.getAttivitaBySagraId(id, signal),
        retry: false,
    })
    const [showDescription, setShowDescription] = useState(true)
    return (
        <ThemedView className="flex-1">
            <BackButton backgroundColor="white" />
            <View
                className="justify-center items-start"
                style={{ marginTop: top, marginLeft: left + BACK_BUTTON_SIZE + 12, minHeight: BACK_BUTTON_SIZE }}
            >
                <ThemedText type="title">Programma</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">{nome}</ThemedText>
            </View>

            <View
                className="flex-row items-center justify-between mx-5 mt-5 px-4 py-3 rounded-2xl bg-white"
            >
                <ThemedText type="smallBold">Mostra descrizioni</ThemedText>
                <Switch
                    trackColor={{ false: "#D1D1D6", true: Colors.primary }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#D1D1D6"
                    value={showDescription}
                    onValueChange={setShowDescription}
                />
            </View>
            <View className="px-5 flex-1 mb-20">
                {isError ?
                    <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />
                    :
                    (isPending ? 
                        <ActivityIndicator color={Colors.primary} />
                        :
                        <AttivitaList attivita={data} showDescription={showDescription} />
                    )
                }
            </View>
        </ThemedView>
    )
}
