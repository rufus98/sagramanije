import { sagraService } from "@/services/sagra.service";
import { useQuery } from "@tanstack/react-query";
import { FlatList } from "react-native";
import SagraCard from "./sagra-card";

export default function SagreList() {

    const query = useQuery({
        queryKey: ['sagre'],
        queryFn: sagraService.getNearbySagre
    })

    return (
        <FlatList 
            data={query.data}
            renderItem={({item}) => <SagraCard sagra={item} />}
        />
    )
}