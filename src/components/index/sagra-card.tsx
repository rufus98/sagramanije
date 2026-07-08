import { Sagra } from "@/types/sagra";
import { View } from "react-native";
import { ThemedText } from "../themed-text";

export default function SagraCard({sagra}: {sagra: Sagra}) {

    return (
        <View className="rounded-3xl bg-white">
            <View className="h-36 p-5">
                <View className="bg-primary">
                    <ThemedText type="default">{sagra.category}</ThemedText>
                </View>
            </View>
            <View className="p-5">
                <ThemedText type="subtitle">{sagra.nome_sagra}</ThemedText>
            </View>
        </View>
    )
}