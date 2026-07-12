import { SafeAreaView } from 'react-native-safe-area-context';

import IndexHeader from '@/components/index/header';
import SagreList from '@/components/index/sagre-list';
import { ThemedView } from '@/components/themed-view';
import { FilterTextInput } from '@/components/ui/text-input';
import { ActivityIndicator, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { sagraService } from '@/services/sagra.service';
import { ThemedText } from '@/components/themed-text';
import ListSwitcher from '@/components/index/list-switcher';
import { useMemo, useState } from 'react';
import useUserLocation from '@/hooks/use-user-location';
import useDebounce from '@/hooks/use-debounce';
import DistanceFilter from '@/components/index/distance-filter';
import MapLibre from '@/components/index/map';
import ErrorState from '@/components/ui/error-state';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const { location, permission, requestLocation } = useUserLocation()
  const [listType, setListType] = useState<"list" | "map">("list")
  const [filterText, setFilterText] = useState("")
  const [filterDistance, setFilterDistance] = useState(-1)
  const debouncedFilterText = useDebounce(filterText, 500)
  const debouncedFilterDistance = useDebounce(filterDistance, 1000)


  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['sagre', location?.lat, location?.lng, debouncedFilterDistance],
    queryFn: () => sagraService.getNearbySagre({ lat: location ? location.lat : null, lng: location ? location.lng : null, raggioKm: debouncedFilterDistance })
  })


  //tengo in cache le sagre finchè non cambia il filtro testo nell'input o i dati originari
  const memoizedSagre = useMemo(() => {
    return data?.filter(x => {
      const loweredBounce = debouncedFilterText.toLowerCase()
      let shouldReturn = false

      let cittaFilter = false
      let nomeFilter = false

      if (location) {
        const distance = sagraService.calculateKmDistance(location?.lat, location?.lng, x.lat, x.leng)
        const formattedDistance = sagraService.formatDistance(distance)
        x.formattedDistance = formattedDistance
      }

      if (x.citta?.toLowerCase().includes(loweredBounce)) cittaFilter = true
      if (x.nome_sagra?.toLowerCase().includes(loweredBounce)) nomeFilter = true

      if(cittaFilter || nomeFilter) shouldReturn = true

      return shouldReturn
    })
  }, [debouncedFilterText,debouncedFilterDistance, data, location])

  return (
    <ThemedView className='flex-1 pt-3 px-5'>
      <SafeAreaView edges={['top']} className="flex-1">
        <IndexHeader location={location} permission={permission} requestLocation={requestLocation} />
        <View className="mt-5">
          <FilterTextInput value={filterText} onChangeText={setFilterText} />
          {location && <DistanceFilter value={filterDistance} setValue={setFilterDistance} />}
        </View>
        <View className="flex-1">
          {/* heading della flatlist */}
          <View className="flex flex-row justify-between my-8 items-center">
            <View className="flex flex-row gap-1">
              <ThemedText type="smallBold" themeColor="primary">{memoizedSagre?.length ?? 0}</ThemedText>
              <ThemedText type="smallBold">sagre vicine</ThemedText>
            </View>
            <ListSwitcher isMap={listType === "map"} setListType={setListType} />
          </View>
          {isError ? (
            <ErrorState onRetry={() => refetch()} isRetrying={isFetching} />
          ) : isPending ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color={Colors.primary} />
            </View>
          ) : listType === "list" ? (
            <SagreList data={memoizedSagre ?? []} location={location} />
          ) : (
            <MapLibre location={location} data={memoizedSagre ?? []} />
          )}
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}