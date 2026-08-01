import { Colors } from "@/constants/theme";
import { ChevronRight, Info, MapPin } from "lucide-react-native";
import { Alert, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import { Coords } from "@/hooks/use-user-location";
import { LocationPermissionResponse } from "expo-location";

type IndexHeaderType = {
    location: Coords,
    locationError: boolean,
    permission: LocationPermissionResponse | null,
    requestLocation: () => Promise<void>
}
export default function IndexHeader({permission, location, locationError, requestLocation}: IndexHeaderType) {


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
                locationError && !location ?
                    <TouchableOpacity
                        onPress={requestLocation}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        className='flex flex-row items-center self-start gap-2 mb-2 px-3 py-2 rounded-full border'
                        style={{ backgroundColor: '#ec5a351a', borderColor: Colors['primary'] }}
                    >
                        <MapPin color={Colors['primary']} size={18} />
                        <ThemedText type="smallBold" themeColor='primary'>
                            Posizione non disponibile — riprova
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
            <View className="flex-row items-center justify-between">
                <ThemedText type="title">Trova la tua sagra</ThemedText>
                <TouchableOpacity
                    onPress={() => Alert.alert(
                        "Informazioni in continuo aggiornamento",
                        "Per alcune sagre, date, informazioni e locandine ufficiali non sono ancora state pubblicate. Prima di partire, verifica sempre l'anno e le date mostrate."
                    )}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Informazioni su date e locandine"
                    hitSlop={10}
                    className="rounded-full bg-white p-2"
                >
                    <Info color={Colors.textSecondary} size={18} />
                </TouchableOpacity>
            </View>
        </View>
    )
}
