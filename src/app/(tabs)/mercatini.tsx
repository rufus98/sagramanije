import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, Text, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import ListSwitcher from '@/components/index/list-switcher';
import MapLibre from '@/components/index/map';
import { MarketGarland, MarketSnow, useMarketMotion } from '@/components/mercatini/decorations';
import MarketCard from '@/components/mercatini/market-card';
import MarketEmptyState from '@/components/mercatini/market-empty-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FilterTextInput } from '@/components/ui/text-input';
import ErrorState from '@/components/ui/error-state';
import { useNearbyEvents } from '@/hooks/use-nearby-events';
import useUserLocation from '@/hooks/use-user-location';
import { isMarket, searchMarkets } from '@/utils/mercatini';

import { MarketColors } from '@/constants/theme';

const countEntering = FadeIn.duration(180).reduceMotion(ReduceMotion.System);

export default function MercatiniScreen() {
  const { location } = useUserLocation();
  const insets = useSafeAreaInsets();
  const motion = useMarketMotion();
  const [query, setQuery] = useState('');
  const [listType, setListType] = useState<'list' | 'map'>('list');
  const catalog = useNearbyEvents(location);
  const results = useMemo(() => searchMarkets(catalog.data ?? [], query), [catalog.data, query]);
  const count = results.length;
  const place = [location?.locationInfo?.citta, location?.locationInfo?.provincia].filter(Boolean).join(', ');

  return (
    <ThemedView className="flex-1">
      {motion && <MarketSnow progress={motion} />}
      <SafeAreaView edges={['top']} className="flex-1 px-5">
        <View className="-mx-5" pointerEvents="none" aria-hidden>
          <MarketGarland progress={motion} />
        </View>
        <View className="flex-row items-center gap-2">
          <MapPin size={18} color={MarketColors.pine} />
          <ThemedText className="flex-1" type="smallBold" style={{ color: MarketColors.pine }}>{place || 'Abruzzo'}</ThemedText>
        </View>
        <ThemedView>
          <ThemedText type="title" style={{ color: MarketColors.pine }}>
            Mercatini di <Text style={{ color: MarketColors.berry }}>Natale</Text>
          </ThemedText>
          <View className="mt-3">
            <FilterTextInput value={query} onChangeText={setQuery} placeholder="Cerca mercatini o città…" selectionColor={MarketColors.berry} />
          </View>
        </ThemedView>
        {catalog.isSuccess && <View className="my-3 flex-row flex-wrap items-center justify-between gap-2">
          <Animated.View key={count} entering={countEntering}>
            <ThemedText type="smallBold">
              <Text style={{ color: MarketColors.berry }}>{count}</Text>
              {count === 1 ? ' mercatino' : ' mercatini'}
            </ThemedText>
          </Animated.View>
          <ListSwitcher isMap={listType === 'map'} activeColor={MarketColors.berry} setListType={type => {
            Keyboard.dismiss();
            setListType(type);
          }} />
        </View>}
        {catalog.isPending ? (
          <View className="flex-1 items-center justify-center"><ActivityIndicator color={MarketColors.pine} /></View>
        ) : catalog.isError ? (
          <ErrorState message="Impossibile caricare i mercatini. Controlla la connessione e riprova." actionColor={MarketColors.berry}
            onRetry={() => catalog.refetch()} isRetrying={catalog.isFetching} />
        ) : listType === 'map' && results.length > 0 ? (
          <MapLibre data={results} variant="mercatini" />
        ) : <FlatList
          data={results}
          keyExtractor={market => String(market.id)}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 76 + insets.bottom, rowGap: 20 },
            results.length === 0 && { flexGrow: 1, justifyContent: 'center' },
          ]}
          renderItem={({ item: market }) => <MarketCard market={market} />}
          ListEmptyComponent={
            <MarketEmptyState onClearSearch={query.trim() && catalog.data.some(isMarket) ? () => setQuery('') : undefined} />
          }
        />}
      </SafeAreaView>
    </ThemedView>
  );
}
