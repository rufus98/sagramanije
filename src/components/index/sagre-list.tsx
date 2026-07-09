import { FlatList } from "react-native";
import SagraCard from "./sagra-card";
import { Sagra } from "@/types/sagra";
import { Coords } from "@/hooks/use-user-location";

export default function SagreList({ data, location }: { data: Sagra[], location: Coords }) {


    return (
        <FlatList
            data={data}
            className="flex-1"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerClassName="gap-8 pb-8"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <SagraCard sagra={item} location={location} />}
        />
    )
}