import { Colors } from "@/constants/theme";
import { MapPin } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import useUserLocation from "@/hooks/use-user-location";


export default function IndexHeader() {

    const {permission, location, requestLocation} = useUserLocation()

    return (
        <View>
            {!location || !permission?.granted ? 
                <TouchableOpacity onPress={requestLocation} className='flex flex-row items-start gap-2'>
                    <MapPin color={Colors["light"]['primary']} size={20} />
                    <ThemedText type="default" themeColor='primary'>
                        Tocca per le sagre vicine
                    </ThemedText>
                </TouchableOpacity>
            :   
                <View className='flex flex-row items-start gap-2'>
                    <MapPin color={Colors["light"]['primary']} size={20} />
                    <ThemedText type="default" themeColor='primary'>
                        {location.locationInfo?.citta}, {location.locationInfo?.provincia}
                    </ThemedText>
                </View>
            }
            <ThemedText type="title">Trova la tua sagra</ThemedText>
        </View>
    )
}