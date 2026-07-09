import { Colors } from "@/constants/theme"
import Slider from "@react-native-community/slider"
import { Dispatch, SetStateAction } from "react"
import { View } from "react-native"
import { ThemedText } from "../themed-text"

type DistanceFilterType = {
    value: number,
    setValue: Dispatch<SetStateAction<number>>
}

const MAX_KM = 50
const STEP = 5
// una tacca oltre la distanza massima reale = "illimitato"
const SLIDER_MAX = MAX_KM + STEP

export default function DistanceFilter({ value, setValue }: DistanceFilterType) {
    const isUnlimited = value === -1

    return (
        <View className="mt-3">
            <Slider
                minimumValue={0}
                maximumValue={SLIDER_MAX}
                minimumTrackTintColor={Colors["light"]["primary"]}
                maximumTrackTintColor="#FFFFFF"
                thumbSize={32}
                step={STEP}
                // lo slider vuole una posizione reale: -1 -> ultima tacca
                value={isUnlimited ? SLIDER_MAX : value}
                onValueChange={(v) => setValue(v >= SLIDER_MAX ? -1 : v)}
            />
            <ThemedText type="smallBold" themeColor="primary">
                Comprese in: {isUnlimited ? "Illimitato" : `${value} km`}
            </ThemedText>
        </View>
    )
}