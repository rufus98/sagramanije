import { Redirect, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { MarketLights } from '@/components/mercatini/decorations';
import WinterLandscape from '@/components/mercatini/winter-landscape';
import { marketCover } from '@/components/mercatini/market-cover';
import EventDetail from '@/components/sagra/event-detail';
import SagraMap from '@/components/sagra/sagra-map';
import { ThemedText } from '@/components/themed-text';
import ErrorState from '@/components/ui/error-state';
import { isMarket, marketPlace } from '@/utils/mercatini';
import { useMarketSeason } from '@/context/market-season';
import { formatDistance, sagraService } from '@/services/sagra.service';

const pine = '#174d3f';

export default function MercatinoPage() {
  const { id, distanza } = useLocalSearchParams<{ id: string; distanza?: string }>();
  const { inSeason } = useMarketSeason();
  const validId = /^\d+$/.test(id);
  const detail = useQuery({
    queryKey: ['sagra', id],
    enabled: inSeason && validId,
    retry: false,
    queryFn: ({ signal }) => sagraService.getById(id, signal),
  });

  if (!inSeason) return <Redirect href="/" />;
  if (!validId || (detail.data && !isMarket(detail.data))) return <Redirect href="/mercatini" />;
  const market = detail.data;
  if (!market) {
    return (
      <EventDetail fallbackCover={marketCover(Number(id))} actionColor={pine}>
        {detail.isError ? (
          <ErrorState message="Impossibile caricare questo mercatino." onRetry={() => detail.refetch()} isRetrying={detail.isFetching} />
        ) : (
          <View className="flex-1 items-center justify-center"><ActivityIndicator color={pine} /></View>
        )}
      </EventDetail>
    );
  }

  const distance = distanza ? Number(distanza) : market.distanza_km;
  const address = marketPlace(market);
  const locationLabel = [address, distance != null && Number.isFinite(distance) && distance >= 0 ? formatDistance(distance) : null]
    .filter(Boolean).join(' · ');
  const share = { title: market.nome_sagra, message: [market.nome_sagra, address].filter(Boolean).join('\n'),
    url: market.link_pagina_ufficiale ?? undefined };

  return (
    <EventDetail poster={market.locandina} fallbackCover={marketCover(market.id)} actionColor={pine} actions={{ destination: market, share }}>
      <ScrollView contentContainerClassName="px-5">
        <View className="flex-row flex-wrap items-center justify-between gap-2">
          <View className="rounded-full bg-[#f5e3df] px-3 py-1">
            <ThemedText type="smallBold" style={{ color: '#8f3344' }}>Mercatino di Natale</ThemedText>
          </View>
          <MarketLights />
        </View>
        <ThemedText type="subtitle" className="mt-2 mb-1" style={{ color: pine }}>{market.nome_sagra}</ThemedText>
        {!!locationLabel && <View className="flex-row gap-2 items-start">
          <MapPin size={16} color={pine} style={{ marginTop: 2 }} />
          <ThemedText type="small" themeColor="textSecondary" className="flex-1">
            {locationLabel}
          </ThemedText>
        </View>}
        <ThemedText className="mt-5 mb-3 font-title" style={{ color: pine }}>Dove</ThemedText>
        <SagraMap sagra={market} />
        <WinterLandscape />
      </ScrollView>
    </EventDetail>
  );
}
