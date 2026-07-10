import { DETAIL_IMAGE_HEIGHT } from "@/components/index/sagra-card";
import { sagraService } from "@/services/sagra.service";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function SagraPage() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { data } = useQuery({
        queryKey: ["sagra", id],
        queryFn: async () => await sagraService.getById(id),
    })

    return (
        <View style={{ flex: 1 }}>
            <Image
                source={data?.locandina}
                style={{ width: "100%", height: DETAIL_IMAGE_HEIGHT }}
                contentFit="cover"
            />
        </View>
    )
}
