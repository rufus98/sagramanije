import { Colors } from "@/constants/theme";
import { MapPin } from "lucide-react-native";
import { View } from "react-native";
import { ThemedText } from "../themed-text";

export default function IndexHeader() {

    return (
        <View>
            <View className='flex flex-row items-start gap-2'>
                <MapPin color={Colors["light"]['primary']} size={20} />
                <ThemedText type="default" themeColor='primary'>
                    Roma, Lazio
                </ThemedText>
            </View>
            <ThemedText type="title">Trova la tua sagra</ThemedText>
        </View>
    )
}