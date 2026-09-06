import { SafeAreaView } from 'react-native-safe-area-context';

import DistanceFilter from '@/components/index/distance-filter';
import DateFilter from '@/components/index/date-filter';
import IndexHeader from '@/components/index/header';
import ListSwitcher from '@/components/index/list-switcher';
import MapLibre from '@/components/index/map';
import SagreEmptyState from '@/components/index/sagre-empty-state';
import SagreList from '@/components/index/sagre-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ErrorState from '@/components/ui/error-state';
import { FilterTextInput } from '@/components/ui/text-input';
import { Colors } from '@/constants/theme';
import useDebounce from '@/hooks/use-debounce';
import useUserLocation from '@/hooks/use-user-location';
import { sagraService } from '@/services/sagra.service';
import { DateFilter as DateFilterValue, matchesDateFilter } from '@/utils/sagra-filters';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function HomeScreen() {
  const { location, locationError, permission, requestLocation } = useUserLocation()
  const [listType, setListType] = useState<"list" | "map">("list")
  const [filterText, setFilterText] = useState("")
  const [filterDistance, setFilterDistance] = useState(-1)
  const [dateFilter, setDateFilter] = useState<DateFilterValue>('all')
  const debouncedFilterText = useDebounce(filterText, 500)
  const debouncedFilterDistance = useDebounce(filterDistance, 1000)


  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['sagre', location?.lat, location?.lng, debouncedFilterDistance],
    queryFn: ({ signal }) => sagraService.getNearbySagre({ lat: location ? location.lat : null, lng: location ? location.lng : null, raggioKm: debouncedFilterDistance }, signal),
    retry: false,
  })


  // Ricerca e periodo sono filtri locali: non richiedono una nuova chiamata API.
  const memoizedSagre = useMemo(() => {
    return data?.filter(x => {
      const query = debouncedFilterText.trim().toLocaleLowerCase('it-IT')
      const searchableText = [x.nome_sagra, x.citta, x.provincia, x.category, x.descrizione]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('it-IT')

      return searchableText.includes(query) && matchesDateFilter(x, dateFilter)
    })
  }, [data, dateFilter, debouncedFilterText])

  const resetFilters = () => {
    setFilterText('')
    setFilterDistance(-1)
    setDateFilter('all')
  }

  return (
    <ThemedView className='flex-1 pt-3 px-5'>
      <SafeAreaView edges={['top']} className="flex-1">
        <KeyboardAwareScrollView mode="layout" className='grow-0 overflow-visible'>

          <IndexHeader location={location} locationError={locationError} permission={permission} requestLocation={requestLocation} />
          <View className="mt-3">
            <FilterTextInput value={filterText} onChangeText={setFilterText} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-4 -mx-5"
              contentContainerClassName="gap-2 px-5"
              keyboardShouldPersistTaps="handled"
            >
              <DateFilter value={dateFilter} onChange={setDateFilter} />
              {location && <DistanceFilter value={filterDistance} setValue={setFilterDistance} />}
            </ScrollView>
          </View>
          {/* heading della flatlist */}
          <View className="flex flex-row justify-between mt-3 mb-3 items-center">
            <View className="flex flex-row gap-1">
              <ThemedText type="smallBold" themeColor="primary">{memoizedSagre?.length ?? 0}</ThemedText>
              <ThemedText type="smallBold">sagre vicine</ThemedText>
            </View>
            <ListSwitcher isMap={listType === "map"} setListType={setListType} />
          </View>
        </KeyboardAwareScrollView>
        <View className="flex-1">
          {isError ? (
            <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />
          ) : isPending ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color={Colors.primary} />
            </View>
          ) : memoizedSagre?.length === 0 ? (
            <SagreEmptyState onReset={resetFilters} />
          ) : listType === "list" ? (
            <SagreList
              key={`${dateFilter}-${debouncedFilterText}-${debouncedFilterDistance}`}
              data={memoizedSagre ?? []}
            />
          ) : (
            <MapLibre location={location} data={memoizedSagre ?? []} />
          )}
        </View>
      </SafeAreaView>
    </ThemedView>

  );
}
