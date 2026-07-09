import { Sagra } from "@/types/sagra";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, Path, Pattern, Rect } from "react-native-svg";
import { ThemedText } from "../themed-text";
import { Calendar, MapPin } from "lucide-react-native";
import Separator from "../ui/separator";
import { Colors } from "@/constants/theme";
import { sagraService } from "@/services/sagra.service";
import { Coords } from "@/hooks/use-user-location";



export default function SagraCard({ sagra, location }: { sagra: Sagra, location: Coords }) {

    const formatDistance = () => {
        if(!location) return ""
        
        return sagraService.formatDistance(
            sagraService.calculateKmDistance(
                location.lat, location.lng, sagra.lat, sagra.leng
            )
        )
    }

    return (
        <View className="rounded-3xl bg-white overflow-hidden">
            <View className="h-36">
                <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
                    <Defs>
                        <Pattern id="stripes" width={45.254} height={45.254} patternUnits="userSpaceOnUse">
                            <Rect width={45.254} height={45.254} fill="rgb(236,90,53)" fillOpacity={0.07} />
                            <Path d="M0 0 L22.627 0 L0 22.627 Z M45.254 0 L45.254 22.627 L22.627 45.254 L0 45.254 Z" fill="rgb(236,90,53)" fillOpacity={0.15} />
                        </Pattern>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#stripes)" />
                </Svg>
                <View className="flex-1 p-5 flex flex-row justify-between items-start">
                    <View className="bg-primary rounded-full py-2 px-3">
                        <ThemedText type="smallBold" style={{ color: "white" }}>{sagra.category}</ThemedText>
                    </View>
                    {location && <View className="bg-white rounded-full py-2 px-3">
                        <ThemedText type="smallBold">{formatDistance()}</ThemedText>
                    </View>}
                </View>
            </View>
            <View className="p-5">
                <ThemedText type="subtitle">{sagra.nome_sagra}</ThemedText>
                <View className="flex flex-row items-center gap-1 mb-2">
                    <MapPin size={12} color={"#8a7a6c"} />
                    <ThemedText className="mt-1" type="small" style={{ color: "#8a7a6c" }}>{sagra.citta}, {sagra.provincia}</ThemedText>
                </View>
                <Separator />
                <View className="flex flex-row justify-between items-center mt-2">
                    <View className="flex flex-row gap-2 items-end">
                        <Calendar color={Colors["light"]["primary"]} size={15} />
                        <ThemedText type="smallBold">
                            {sagra.data_inizio && sagra.data_fine ?
                                `${sagra.data_inizio.toLocaleDateString("it-IT", { day: "numeric", month: "short" })} - ${sagra.data_fine.toLocaleDateString("it-IT", { day: "numeric", month: "short" })} `
                                :
                                "Data non disponibile"
                            }
                        </ThemedText>
                    </View>
                </View>
            </View>
        </View>
    )
}