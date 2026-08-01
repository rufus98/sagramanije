import { GiornoAttivita } from "@/types/attivita";
import { View } from "react-native";
import { ThemedText } from "../themed-text";
import AttivitaRow from "./attivita-row";

export default function AttivitaDay({attivita, showDescription}: {attivita: GiornoAttivita, showDescription: boolean}) {

    const formatDay = () => {
        const s = attivita.giorno.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    return (
        <View className="mt-5">
            <ThemedText type="subtitle">{formatDay()}</ThemedText>
            <View className="mt-5 bg-white rounded-3xl">
                {attivita.attivita.map((item, index) => (
                    <AttivitaRow attivita={item} key={index} showDescription={showDescription} />
                ))}
            </View>
        </View>
    )
}