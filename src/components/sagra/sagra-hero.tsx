import ImagePlaceholder from "@/components/index/image-placeholder";
import { DETAIL_IMAGE_HEIGHT } from "@/components/index/sagra-card";
import { Image } from "expo-image";
import { Expand } from "lucide-react-native";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useBackButtonOffset } from "./back-button";
import PosterViewer from "./poster-viewer";

const IMAGE_FADE_DURATION = 400;

// Immagine di testa del dettaglio con overlay scuro che sfuma
// dentro insieme alla foto (niente comparsa "a scatto").
export default function SagraHero({ source }: { source?: string | null }) {
    // Se all'ingresso la foto c'è già (passata dalla card, in cache) la mostriamo
    // subito senza fade; il fade serve solo quando arriva dopo (da rete).
    const hasInitialSource = useRef(!!source).current
    const [viewerVisible, setViewerVisible] = useState(false)
    const { top, left } = useBackButtonOffset()

    const overlayOpacity = useSharedValue(hasInitialSource ? 1 : 0)
    const overlayStyle = useAnimatedStyle(() => ({ opacity: overlayOpacity.value }))

    return (
        <View style={{ height: DETAIL_IMAGE_HEIGHT }}>
            {/* Livello di base: se la foto manca o non è ancora arrivata, resta visibile */}
            <ImagePlaceholder />
            <Image
                source={source}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                transition={hasInitialSource ? 0 : IMAGE_FADE_DURATION}
                onLoad={() => { overlayOpacity.value = withTiming(1, { duration: IMAGE_FADE_DURATION }) }}
            />
            <Animated.View
                pointerEvents="none"
                style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.35)" }, overlayStyle]}
            />
            {source && (
                <>
                    <Pressable
                        onPress={() => setViewerVisible(true)}
                        accessibilityRole="button"
                        accessibilityLabel="Apri locandina a schermo intero"
                        hitSlop={8}
                        className="absolute z-10 rounded-2xl bg-black/55 p-3 active:opacity-75"
                        style={{ top, right: left }}
                    >
                        <Expand color="#fff" size={22} />
                    </Pressable>
                    <PosterViewer
                        source={source}
                        visible={viewerVisible}
                        onClose={() => setViewerVisible(false)}
                    />
                </>
            )}
        </View>
    )
}
