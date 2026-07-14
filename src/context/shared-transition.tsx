import { Image } from "expo-image";
import { createContext, useContext, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export type Rect = { x: number; y: number; width: number; height: number };

type SharedTransitionContextValue = {
    // Anima una copia flottante dell'immagine da `from` a `to`.
    start: (uri: string, from: Rect, to: Rect) => void;
};

const SharedTransitionContext = createContext<SharedTransitionContextValue | null>(null);

export function useSharedTransition() {
    const ctx = useContext(SharedTransitionContext);
    if (!ctx) throw new Error("useSharedTransition deve stare dentro <SharedTransitionProvider>");
    return ctx;
}

const DURATION = 300;

export function SharedTransitionProvider({ children }: { children: React.ReactNode }) {
    const [uri, setUri] = useState<string | null>(null);

    const x = useSharedValue(0);
    const y = useSharedValue(0);
    const w = useSharedValue(0);
    const h = useSharedValue(0);
    const radius = useSharedValue(0);

    const start = (imageUri: string, from: Rect, to: Rect) => {
        // Posiziona la copia sulla card...
        x.value = from.x;
        y.value = from.y;
        w.value = from.width;
        h.value = from.height;
        radius.value = 24;
        setUri(imageUri);

        // ...e animala fino alla posizione finale nel dettaglio.
        const cfg = { duration: DURATION, easing: Easing.out(Easing.cubic) };
        x.value = withTiming(to.x, cfg);
        y.value = withTiming(to.y, cfg);
        w.value = withTiming(to.width, cfg);
        radius.value = withTiming(0, cfg);
        h.value = withTiming(to.height, cfg, (finished) => {
            "worklet";
            // A fine animazione nascondi l'overlay: sotto c'è già l'immagine reale del dettaglio.
            if (finished) runOnJS(setUri)(null);
        });
    };

    const style = useAnimatedStyle(() => ({
        position: "absolute",
        left: x.value,
        top: y.value,
        width: w.value,
        height: h.value,
        borderRadius: radius.value,
        overflow: "hidden",
    }));

    return (
        <SharedTransitionContext.Provider value={{ start }}>
            {children}
            {uri && (
                <Animated.View pointerEvents="none" style={style}>
                    <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
                </Animated.View>
            )}
        </SharedTransitionContext.Provider>
    );
}
