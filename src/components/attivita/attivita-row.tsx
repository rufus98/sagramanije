import { Colors } from "@/constants/theme";
import { Attivita } from "@/types/attivita";
import { View } from "react-native";
import { ThemedText } from "../themed-text";

export default function AttivitaRow({ attivita }: { attivita: Attivita }) {
    const { ora_inizio, ora_fine, titolo, descrizione } = attivita;

    return (
        <View className="flex-row gap-3 mb-3">
            {/* Colonna orari */}
            <View className="w-16 items-end pt-3">
                {ora_inizio ? (
                    <>
                        <ThemedText type="smallBold" themeColor="primary">{ora_inizio}</ThemedText>
                        {ora_fine && (
                            <ThemedText type="smallBold" themeColor="textSecondary">
                                {ora_fine}
                            </ThemedText>
                        )}
                    </>
                ) : (
                    <ThemedText type="small" themeColor="textSecondary">
                        —
                    </ThemedText>
                )}
            </View>

            {/* Card titolo + descrizione */}
            <View className="flex-1 rounded-2xl px-4 py-3">
                <ThemedText type="smallBold">{titolo}</ThemedText>
                {descrizione && (
                    <ThemedText type="small" themeColor="textSecondary" className="mt-1">
                        {descrizione}
                    </ThemedText>
                )}
            </View>
        </View>
    );
}
