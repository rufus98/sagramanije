import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { MapPin } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { formatDistance } from '@/services/sagra.service';
import type { Sagra } from '@/types/sagra';
import { marketPlace } from '@/utils/mercatini';
import { marketCover } from './market-cover';

type Props = { market: Sagra };

export default function MarketCard({ market }: Props) {
  const distance = market.distanza_km;
  const place = marketPlace(market);
  const router = useRouter();
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  return (
    <TouchableOpacity accessibilityRole="button" activeOpacity={0.8}
      onPress={() => router.push({ pathname: '/mercatino/[id]', params: {
        id: String(market.id), ...(distance != null && { distanza: String(distance) }),
      } })}
      className="overflow-hidden rounded-3xl bg-white">
      <View className="h-36">
        <Image source={marketCover(market.id)} contentFit="cover" style={StyleSheet.absoluteFill} />
        {market.locandina && market.locandina !== failedUrl && (
          <Image source={{ uri: market.locandina }} contentFit="cover" style={StyleSheet.absoluteFill}
            onError={() => setFailedUrl(market.locandina)} />
        )}
        <View className="flex-row justify-between items-start p-4">
          <View className="rounded-full bg-[#983749] px-3 py-2">
            <ThemedText type="smallBold" style={{ color: '#fff' }}>Mercatino di Natale</ThemedText>
          </View>
          {distance != null && (
            <View className="rounded-full bg-white px-3 py-2"><ThemedText type="smallBold">{formatDistance(distance)}</ThemedText></View>
          )}
        </View>
      </View>
      <View className="p-5">
        <ThemedText type="subtitle">{market.nome_sagra}</ThemedText>
        {!!place && <View className="mt-1 flex-row items-center gap-1">
          <MapPin size={14} color="#796c61" />
          <ThemedText className="flex-1" type="small" themeColor="textSecondary">{place}</ThemedText>
        </View>}
      </View>
    </TouchableOpacity>
  );
}
