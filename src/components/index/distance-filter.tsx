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
                minimumTrackTintColor={Colors["primary"]}
                maximumTrackTintColor={Colors["backgroundSelected"]}
                thumbTintColor={Colors["primary"]}
                thumbSize={30}

                step={STEP}
                // lo slider vuole una posizione reale: -1 -> ultima tacca
                value={isUnlimited ? SLIDER_MAX : value}
                onValueChange={(v) => setValue(v >= SLIDER_MAX ? -1 : v)}
            />
            <View className="flex flex-row gap-1 mt-2">
                <ThemedText type="smallBold">
                    Nel raggio di: 
                </ThemedText>
                <ThemedText type="smallBold" themeColor="primary">
                    {isUnlimited ? "Illimitato" : `${value} km`}
                </ThemedText>
            </View>
        </View>
    )
}