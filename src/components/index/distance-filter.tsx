import { Colors } from "@/constants/theme"
import Slider from "@react-native-community/slider"
import { Dispatch, SetStateAction, useState } from "react"
import { View } from "react-native"
import { ThemedText } from "../themed-text"

type DistanceFilterType = {
    value: number,
    setValue: Dispatch<SetStateAction<number>>
}

const MIN_KM = 5
const MAX_KM = 50
const STEP = 5
// una tacca oltre la distanza massima reale = "illimitato"
const SLIDER_MAX = MAX_KM + STEP

const THUMB_SIZE = 30
const CUBE_SIZE = 16
const CUBE_COUNT = (SLIDER_MAX - MIN_KM) / STEP + 1

const Skewer = {
    stick: "#c69963",
    stickShade: "#a97c4f",
    rawMeat: "#f0c8b4",
    fat: "#f5e6cd",
} as const

// inclinazioni fisse per indice: i cubetti veri non sono mai allineati
const tilt = (i: number) => ((i * 37) % 15) - 7

export default function DistanceFilter({ value, setValue }: DistanceFilterType) {
    const isUnlimited = value === -1
    const [trackWidth, setTrackWidth] = useState(0)

    const selectedIndex = isUnlimited ? CUBE_COUNT - 1 : (value - MIN_KM) / STEP
    // il thumb nativo si muove tra questi due estremi: i cubetti devono seguirlo
    const travel = Math.max(trackWidth - THUMB_SIZE, 0)

    return (
        <View className="mt-5">
            <View className="relative justify-center" onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}>
                <Slider
                    minimumValue={MIN_KM}
                    maximumValue={SLIDER_MAX}
                    minimumTrackTintColor={Skewer.stickShade}
                    maximumTrackTintColor={Skewer.stick}
                    thumbTintColor="#00000000"
                    thumbSize={THUMB_SIZE}

                    step={STEP}
                    // lo slider vuole una posizione reale: -1 -> ultima tacca
                    value={isUnlimited ? SLIDER_MAX : value}
                    onValueChange={(v) => setValue(v >= SLIDER_MAX ? -1 : v)}
                />

                <View pointerEvents="none" className="absolute inset-0 justify-center">
                    {trackWidth > 0 && Array.from({ length: CUBE_COUNT }, (_, i) => {
                        const isSelected = i === selectedIndex
                        const isCooked = i <= selectedIndex
                        const isUnlimitedCube = i === CUBE_COUNT - 1
                        const size = isSelected ? CUBE_SIZE + 6 : CUBE_SIZE

                        return (
                            <View
                                key={i}
                                className="absolute rounded-[3px]"
                                style={{
                                    width: size,
                                    height: size,
                                    left: THUMB_SIZE / 2 + (i / (CUBE_COUNT - 1)) * travel - size / 2,
                                    backgroundColor: isUnlimitedCube
                                        ? Skewer.fat
                                        : isCooked
                                            ? Colors["primary"]
                                            : Skewer.rawMeat,
                                    // il cubetto attivo va staccato dallo stecco: bordo chiaro + ombra = "afferrabile"
                                    borderWidth: isSelected ? 1 : 0,
                                    borderColor: isSelected ? "#ffffff" : Skewer.stickShade,
                                    opacity: isCooked ? 1 : 0.6,
                                    transform: [{ rotate: `${tilt(i)}deg` }],
                                    ...(isSelected && {
                                        shadowColor: "#000000",
                                        shadowOpacity: 0.3,
                                        shadowRadius: 4,
                                        shadowOffset: { width: 0, height: 2 },
                                        elevation: 5,
                                    }),
                                }}
                            />
                        )
                    })}
                </View>
            </View>

            <View className="flex flex-row justify-between mt-1">
                <ThemedText type="small" themeColor="textSecondary">
                    {MIN_KM} km
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                    Illimitato
                </ThemedText>
            </View>

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
