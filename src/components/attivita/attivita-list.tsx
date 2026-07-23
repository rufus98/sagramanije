import { GiornoAttivita } from "@/types/attivita";
import { FlatList, View } from "react-native";
import AttivitaDay from "./attivita-day";

export default function AttivitaList({attivita, showDescription}: {attivita: GiornoAttivita[], showDescription: boolean}) {

    return(
        <FlatList
            data={attivita}
            windowSize={8}
            maxToRenderPerBatch={5}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <AttivitaDay attivita={item} showDescription={showDescription}/>}
        />
    )
}