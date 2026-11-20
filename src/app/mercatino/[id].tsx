import { Redirect, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { Calendar } from 'lucide-react-native';
import { formatDateRange } from '@/components/date-formatter';
import WinterLandscape from '@/components/mercatini/winter-landscape';
import { marketCover } from '@/components/mercatini/market-cover';
import EventDetail from '@/components/sagra/event-detail';
import SagraActionCards from '@/components/sagra/sagra-action-cards';
import SagraMap from '@/components/sagra/sagra-map';
import { ThemedText } from '@/components/themed-text';
import ErrorState from '@/components/ui/error-state';
import { MarketColors } from '@/constants/theme';
import { isMarket, marketPlace } from '@/utils/mercatini';
import { useMarketSeason } from '@/context/market-season';
import { formatDistance, sagraService } from '@/services/sagra.service';

const SHOW_MARKET_PROGRAM_AND_DESCRIPTION = false;

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
      <EventDetail fallbackCover={marketCover(Number(id))}>
        {detail.isError ? (
          <ErrorState message="Impossibile caricare questo mercatino." actionColor={MarketColors.berry}
            onRetry={() => detail.refetch()} isRetrying={detail.isFetching} />
        ) : (
          <View className="flex-1 items-center justify-center"><ActivityIndicator color={MarketColors.berry} /></View>
        )}
      </EventDetail>
    );
  }

  const distance = distanza ? Number(distanza) : market.distanza_km;
  const distanceLabel = distance != null && Number.isFinite(distance) && distance >= 0 ? formatDistance(distance) : null;
  const town = [market.citta, market.provincia].filter(Boolean).join(', ');
  const street = market.indirizzo?.trim();
  const dates = formatDateRange(market, 'long');
  const startTime = market.ora_inizio?.trim();
  const description = market.descrizione?.trim();
  const share = {
    title: market.nome_sagra,
    message: [market.nome_sagra, marketPlace(market)].filter(Boolean).join('\n'),
    url: `https://sagramanije.it/sagra/${market.id}`,
  };

  return (
    <EventDetail poster={market.locandina} fallbackCover={marketCover(market.id)} actionColor={MarketColors.berry} actions={{ destination: market, share }}>
      <ScrollView contentContainerClassName="px-5">
        <View className="flex-row flex-wrap justify-between gap-x-2">
          <ThemedText type="smallBold" themeColor="textSecondary">Mercatino di Natale</ThemedText>
          {!!distanceLabel && <ThemedText type="smallBold">{distanceLabel}</ThemedText>}
        </View>
        <ThemedText type="subtitle" className="mt-4">{market.nome_sagra}</ThemedText>
        {!!town && <ThemedText type="small" themeColor="textSecondary">{town}</ThemedText>}

        <View className="mt-5 flex-row items-center gap-3 border-y border-[#eaded4] py-5">
          <View className="min-h-12 flex-1 justify-center">
            <ThemedText type="defaultSemiBold">{dates ?? 'Data non disponibile'}</ThemedText>
            {!!startTime && <ThemedText type="small" themeColor="textSecondary">{startTime}</ThemedText>}
          </View>
          <Calendar size={22} color={MarketColors.berry} />
        </View>

        {SHOW_MARKET_PROGRAM_AND_DESCRIPTION && market.ha_attivita === true && <SagraActionCards sagra={market} />}

        {SHOW_MARKET_PROGRAM_AND_DESCRIPTION && !!description && (
          <View className="mt-5">
            <ThemedText className="font-title">Il mercatino</ThemedText>
            <ThemedText className="mt-3" type="default" themeColor="textSecondary">{description}</ThemedText>
          </View>
        )}

        <View className="mt-5">
          <View className="mb-3">
            <ThemedText className="font-title">Dove</ThemedText>
            {!!street && <ThemedText type="small" themeColor="textSecondary">{street}</ThemedText>}
          </View>
          <SagraMap sagra={market} variant="mercatini" />
          <WinterLandscape />
        </View>
      </ScrollView>
    </EventDetail>
  );
}
