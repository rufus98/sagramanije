import { sagraService } from "@/services/sagra.service";
import { useQuery } from "@tanstack/react-query";
import { FlatList } from "react-native";
import { ThemedText } from "../themed-text";

export default function SagreList() {

    const query = useQuery({
        queryKey: ['sagre'],
        queryFn: sagraService.getNearbySagre
    })

    return (
        <FlatList 
            data={query.data}
            renderItem={() => <ThemedText>Ciao</ThemedText>}
        />
    )
}