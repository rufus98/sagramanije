import { SafeAreaView } from 'react-native-safe-area-context';

import DistanceFilter from '@/components/index/distance-filter';
import IndexHeader from '@/components/index/header';
import ListSwitcher from '@/components/index/list-switcher';
import MapLibre from '@/components/index/map';
import SagreList from '@/components/index/sagre-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ErrorState from '@/components/ui/error-state';
import { FilterTextInput } from '@/components/ui/text-input';
import { Colors } from '@/constants/theme';
import useDebounce from '@/hooks/use-debounce';
import useUserLocation from '@/hooks/use-user-location';
import { sagraService } from '@/services/sagra.service';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function HomeScreen() {
  const { location, locationError, permission, requestLocation } = useUserLocation()
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

      if (x.citta?.toLowerCase().includes(loweredBounce)) cittaFilter = true
      if (x.nome_sagra?.toLowerCase().includes(loweredBounce)) nomeFilter = true

      if (cittaFilter || nomeFilter) shouldReturn = true

      return shouldReturn
    })
  }, [debouncedFilterText, debouncedFilterDistance, data, location])

  return (
    <ThemedView className='flex-1 pt-3 px-5'>
      <SafeAreaView edges={['top']} className="flex-1">
        <KeyboardAwareScrollView mode="layout" className='grow-0 overflow-visible'>

          <IndexHeader location={location} locationError={locationError} permission={permission} requestLocation={requestLocation} />
          <View className="mt-5">
            <FilterTextInput value={filterText} onChangeText={setFilterText} />
            {location && <DistanceFilter value={filterDistance} setValue={setFilterDistance} />}
          </View>
          {/* heading della flatlist */}
          <View className="flex flex-row justify-between my-8 items-center">
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
          ) : listType === "list" ? (
            <SagreList data={memoizedSagre ?? []} />
          ) : (
            <MapLibre location={location} data={memoizedSagre ?? []} />
          )}
        </View>
      </SafeAreaView>
    </ThemedView>

  );
}