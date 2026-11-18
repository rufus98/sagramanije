import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import { MarketGap, MarketLights } from '@/components/mercatini/decorations';
import MarketCard from '@/components/mercatini/market-card';
import MarketEmptyState from '@/components/mercatini/market-empty-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FilterTextInput } from '@/components/ui/text-input';
import ErrorState from '@/components/ui/error-state';
import { useNearbyEvents } from '@/hooks/use-nearby-events';
import useUserLocation from '@/hooks/use-user-location';
import { isMarket, searchMarkets } from '@/utils/mercatini';

const green = '#174d3f';

export default function MercatiniScreen() {
  const { location } = useUserLocation();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const catalog = useNearbyEvents(location);
  const results = useMemo(() => searchMarkets(catalog.data ?? [], query), [catalog.data, query]);
  const place = [location?.locationInfo?.citta, location?.locationInfo?.provincia].filter(Boolean).join(', ');

  return (
    <ThemedView className="flex-1 px-5 pt-3">
      <SafeAreaView edges={['top']} className="flex-1">
        <View className="flex-row items-center justify-between gap-2">
          <View className="flex-1 flex-row items-center gap-2">
            <MapPin size={18} color={green} />
            <ThemedText className="flex-1" type="smallBold" style={{ color: green }}>{place || 'Abruzzo'}</ThemedText>
          </View>
          <MarketLights />
        </View>
        <ThemedText type="title" style={{ color: green }}>Mercatini di Natale</ThemedText>
        <View className="mt-3"><FilterTextInput value={query} onChangeText={setQuery} placeholder="Cerca mercatini o città…" /></View>
        {catalog.isSuccess && results.length > 0 && <View className="my-3">
          <ThemedText type="smallBold">{results.length} {results.length === 1 ? 'mercatino' : 'mercatini'}</ThemedText>
        </View>}
        {catalog.isPending ? (
          <View className="flex-1 items-center justify-center"><ActivityIndicator color={green} /></View>
        ) : catalog.isError ? (
          <ErrorState message="Impossibile caricare i mercatini. Controlla la connessione e riprova."
            onRetry={() => catalog.refetch()} isRetrying={catalog.isFetching} />
        ) : <FlatList
          data={results}
          keyExtractor={market => String(market.id)}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 76 + insets.bottom },
            results.length === 0 && { flexGrow: 1, justifyContent: 'center' },
          ]}
          renderItem={({ item: market, index }) => (
            <View>
              <MarketGap index={index} />
              <MarketCard market={market} />
            </View>
          )}
          ListEmptyComponent={
            <MarketEmptyState onClearSearch={query.trim() && catalog.data.some(isMarket) ? () => setQuery('') : undefined} />
          }
        />}
      </SafeAreaView>
    </ThemedView>
  );
}
