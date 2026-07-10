import { DETAIL_IMAGE_HEIGHT } from "@/components/index/sagra-card";
import { Image } from "expo-image";
import { useRef } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const IMAGE_FADE_DURATION = 400;

// Immagine di testa del dettaglio con overlay scuro che sfuma
// dentro insieme alla foto (niente comparsa "a scatto").
export default function SagraHero({ source }: { source?: string | null }) {
    // Se all'ingresso la foto c'è già (passata dalla card, in cache) la mostriamo
    // subito senza fade; il fade serve solo quando arriva dopo (da rete).
    const hasInitialSource = useRef(!!source).current

    const overlayOpacity = useSharedValue(hasInitialSource ? 1 : 0)
    const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }))

    return (
        <View>
            <Image
                source={source}
                style={{ width: "100%", height: DETAIL_IMAGE_HEIGHT }}
                contentFit="cover"
                transition={hasInitialSource ? 0 : IMAGE_FADE_DURATION}
                onLoad={() => { overlayOpacity.value = withTiming(1, { duration: IMAGE_FADE_DURATION }) }}
            />
            <Animated.View
                pointerEvents="none"
                className="absolute top-0 left-0 right-0"
                style={[{ height: DETAIL_IMAGE_HEIGHT, backgroundColor: "rgba(0,0,0,0.35)" }, overlayStyle]}
            />
        </View>
    )
}
