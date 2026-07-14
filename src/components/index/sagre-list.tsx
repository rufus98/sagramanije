import { Sagra } from "@/types/sagra";
import { FlatList } from "react-native";
import SagraCard from "./sagra-card";

export default function SagreList({ data }: { data: Sagra[] }) {

    return (
        <FlatList
            data={data}
            windowSize={5}
            maxToRenderPerBatch={5}
            className="flex-1"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerClassName="gap-8 pb-8"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <SagraCard sagra={item} />}
        />
    )
}