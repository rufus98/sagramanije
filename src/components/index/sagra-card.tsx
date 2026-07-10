import { Sagra } from "@/types/sagra";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import { Calendar, MapPin } from "lucide-react-native";
import Separator from "../ui/separator";
import { Colors } from "@/constants/theme";
import { Coords } from "@/hooks/use-user-location";
import { memo, useRef, useState } from "react";
import ImagePlaceholder from "./image-placeholder";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useSharedTransition } from "@/context/shared-transition";

// Deve combaciare con l'altezza dell'immagine nel dettaglio (sagra/[id].tsx).
export const DETAIL_IMAGE_HEIGHT = 350;


function SagraCard({ sagra, location }: { sagra: Sagra, location: Coords }) {
    const router = useRouter()
    const { start } = useSharedTransition()
    const imageRef = useRef<View>(null)
    const [imageLoaded, setImageLoaded] = useState(false)

    const onPress = () => {
        // Senza foto: niente transizione, navighiamo e basta.
        if (!sagra.locandina || !imageRef.current) {
            router.push(`/sagra/${sagra.id}`)
            return
        }
        // Passiamo la locandina (già in cache) al dettaglio così l'hero
        // la mostra subito senza aspettare getById: niente "scatto".
        const href = { pathname: "/sagra/[id]" as const, params: { id: sagra.id, locandina: sagra.locandina } }
        // Misuriamo la foto sullo schermo, poi animiamo la copia flottante
        // fino alla posizione finale in cima al dettaglio.
        imageRef.current.measureInWindow((x, y, width, height) => {
            start(
                sagra.locandina!,
                { x, y, width, height },
                { x: 0, y: 0, width: Dimensions.get("window").width, height: DETAIL_IMAGE_HEIGHT },
            )
            router.push(href)
        })
    }

    return (
        <TouchableOpacity onPress={onPress} className="rounded-3xl bg-white overflow-hidden">
            <View className="h-36">
                {(!sagra.locandina || !imageLoaded) && <ImagePlaceholder />}
                {sagra.locandina &&
                    <View ref={imageRef} collapsable={false} style={StyleSheet.absoluteFill}>
                        <Image
                            source={{ uri: sagra.locandina }}
                            style={StyleSheet.absoluteFill}
                            transition={200}
                            onLoad={() => setImageLoaded(true)}
                        />
                    </View>
                }
                <View className="flex-1 p-5 flex flex-row justify-between items-start">
                    <View className="bg-primary rounded-full py-2 px-3">
                        <ThemedText type="smallBold" style={{ color: "white" }}>{sagra.category}</ThemedText>
                    </View>
                    {location && <View className="bg-white rounded-full py-2 px-3">
                        <ThemedText type="smallBold">{sagra.formattedDistance}</ThemedText>
                    </View>}
                </View>
            </View>
            <View className="p-5">
                <ThemedText type="subtitle" className="mb-1">{sagra.nome_sagra}</ThemedText>
                <View className="flex flex-row items-center gap-1 mb-2">
                    <MapPin size={12} color={"#8a7a6c"} />
                    <ThemedText className="mt-1" type="small" style={{ color: "#8a7a6c" }}>{sagra.citta}, {sagra.provincia}</ThemedText>
                </View>
                <Separator />
                <View className="flex flex-row justify-between items-center mt-2">
                    <View className="flex flex-row gap-2 items-center">
                        <Calendar color={Colors["primary"]} size={15} />
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
        </TouchableOpacity>
    )
}

export default memo(SagraCard)