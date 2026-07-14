import { Colors } from "@/constants/theme";
import { ChevronRight, MapPin } from "lucide-react-native";
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
                <TouchableOpacity
                    onPress={requestLocation}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    className='flex flex-row items-center self-start gap-2 mb-2 px-3 py-2 rounded-full border'
                    style={{ backgroundColor: '#ec5a351a', borderColor: Colors['primary'] }}
                >
                    <MapPin color={Colors['primary']} size={18} />
                    <ThemedText type="smallBold" themeColor='primary'>
                        Tocca per le sagre vicine
                    </ThemedText>
                    <ChevronRight color={Colors['primary']} size={16} />
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