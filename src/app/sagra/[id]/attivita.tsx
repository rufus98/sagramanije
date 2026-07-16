import BackButton, { BACK_BUTTON_SIZE, useBackButtonOffset } from "@/components/sagra/back-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ScrollView, View } from "react-native";

export default function Attivita() {
    const { top, left } = useBackButtonOffset();

    return (
        <ThemedView className="flex-1">
            <BackButton backgroundColor="white" />
            <View
                className="justify-center"
                style={{ marginTop: top, marginLeft: left + BACK_BUTTON_SIZE + 12, minHeight: BACK_BUTTON_SIZE }}
            >
                <ThemedText type="title">Programma</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">Sagra della porchetta</ThemedText>
            </View>

            <ScrollView className="px-5">

            </ScrollView>
        </ThemedView>
    )
}
