import { Colors } from "@/constants/theme";
import { MapPin } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import useUserLocation, { Coords } from "@/hooks/use-user-location";
import { LocationPermissionResponse } from "expo-location";

type IndexHeaderType = {
    location: Coords,
    permission: LocationPermissionResponse | null,
    requestLocation: () => Promise<void>
}
export default function IndexHeader({permission, location, requestLocation}: IndexHeaderType) {


    return (
        <View>
            {!permission?.granted ?
                <TouchableOpacity onPress={requestLocation} className='flex flex-row items-start gap-2'>
                    <MapPin color={Colors['primary']} size={20} />
                    <ThemedText type="default" themeColor='primary'>
                        Tocca per le sagre vicine
                    </ThemedText>
                </TouchableOpacity>
            :
                <View className='flex flex-row items-start gap-2'>
                    <MapPin color={Colors['primary']} size={20} />
                    <ThemedText type="default" themeColor='primary'>
                        {location
                            ? `${location.locationInfo?.citta}, ${location.locationInfo?.provincia}`
                            : "Recupero posizione…"}
                    </ThemedText>
                </View>
            }
            <ThemedText type="title">Trova la tua sagra</ThemedText>
        </View>
    )
}