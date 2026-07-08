import { FlatList, View } from "react-native";
import SagraCard from "./sagra-card";
import { ThemedText } from "../themed-text";
import { Sagra } from "@/types/sagra";

export default function SagreList({ data }: { data: Sagra[] }) {


    return (
        <FlatList
            data={data}
            contentContainerClassName="gap-8"
            renderItem={({ item }) => <SagraCard sagra={item} />}
        />
    )
}