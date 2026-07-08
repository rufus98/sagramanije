import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import { Dispatch, SetStateAction } from "react";

type ListSwitcherType = {
    isMap: boolean,
    setListType: Dispatch<SetStateAction<"list" | "map">>
}
export default function ListSwitcher({ isMap, setListType }: ListSwitcherType) {

    return (
        <View className="bg-[#f0e3d3] flex flex-row rounded-xl p-1">
            <TouchableOpacity onPress={() => setListType("list")} className={`py-3 px-4 rounded-xl ${!isMap ? 'bg-white' : ''}`}>
                <ThemedText type="smallBold" themeColor={!isMap ? "primary" : "text"}>Lista</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setListType("map")} className={`py-3 px-4 rounded-xl ${isMap ? 'bg-white' : ''}`}>
                <ThemedText type="smallBold" themeColor={isMap ? "primary" : "text"}>Mappa</ThemedText>
            </TouchableOpacity>
        </View>
    )
}