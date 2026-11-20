import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

type ListSwitcherType = {
    isMap: boolean,
    setListType: (type: "list" | "map") => void,
    activeColor?: string,
}
export default function ListSwitcher({ isMap, setListType, activeColor }: ListSwitcherType) {

    return (
        <View className="bg-[#f0e3d3] flex flex-row rounded-xl p-1">
            <TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: !isMap }}
                onPress={() => setListType("list")} className={`py-3 px-4 rounded-xl ${!isMap ? 'bg-white' : ''}`}>
                <ThemedText type="smallBold" themeColor={!isMap ? "primary" : "text"}
                    style={!isMap && activeColor ? { color: activeColor } : undefined}>Lista</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity accessibilityRole="button" accessibilityState={{ selected: isMap }}
                onPress={() => setListType("map")} className={`py-3 px-4 rounded-xl ${isMap ? 'bg-white' : ''}`}>
                <ThemedText type="smallBold" themeColor={isMap ? "primary" : "text"}
                    style={isMap && activeColor ? { color: activeColor } : undefined}>Mappa</ThemedText>
            </TouchableOpacity>
        </View>
    )
}
