import { Sagra } from "@/types/sagra";
import { FlatList } from "react-native";
import Animated, { FadeInRight, ReduceMotion } from "react-native-reanimated";
import SagraCard from "./sagra-card";

export default function SagreList({ data }: { data: Sagra[] }) {

    return (
        <FlatList
            data={data}
            windowSize={5}
            maxToRenderPerBatch={5}
            className="flex-1"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerClassName="gap-8 pb-8"
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item, index }) => (
                <Animated.View
                    entering={FadeInRight
                        .duration(300)
                        .delay(Math.min(index, 5) * 45)
                        .reduceMotion(ReduceMotion.System)}
                >
                    <SagraCard sagra={item} />
                </Animated.View>
            )}
        />
    )
}
