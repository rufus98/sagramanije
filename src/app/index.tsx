import { SafeAreaView } from 'react-native-safe-area-context';

import IndexHeader from '@/components/index/header';
import SagreList from '@/components/index/sagre-list';
import { ThemedView } from '@/components/themed-view';
import { FilterTextInput } from '@/components/ui/text-input';
import { View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { sagraService } from '@/services/sagra.service';
import { ThemedText } from '@/components/themed-text';
import ListSwitcher from '@/components/index/list-switcher';
import { useMemo, useState } from 'react';
import useUserLocation from '@/hooks/use-user-location';
import useDebounce from '@/hooks/use-debounce';

export default function HomeScreen() {
  const { location } = useUserLocation()
  const { data } = useQuery({
    queryKey: ['sagre', location?.lat, location?.lng],
    queryFn: () => sagraService.getNearbySagre({ lat: location ? location.lat : null, lng: location ? location.lng : null })
  })

  const [listType, setListType] = useState<"list" | "map">("list")
  const [filterText, setFilterText] = useState("")
  const debouncedFilterText = useDebounce(filterText, 300)

  //tengo in cache le sagre finchè non cambia il filtro testo nell'input o i dati originari
  const memoizedSagre = useMemo(() => {
    return data?.filter(x => {
      const loweredBounce = debouncedFilterText.toLowerCase()
      let shouldReturn = false
      if (x.citta?.toLowerCase().includes(loweredBounce)) shouldReturn = true
      if (x.nome_sagra?.toLowerCase().includes(loweredBounce)) shouldReturn = true
      return shouldReturn
    })
  }, [debouncedFilterText, data])

  return (
    <ThemedView className='flex-1 pt-3 px-5'>
      <SafeAreaView edges={['top']} className="flex-1">
        <IndexHeader />
        <View className="mt-5">
          <FilterTextInput value={filterText} onChangeText={setFilterText} />
        </View>
        <View className="flex-1">
          {/* heading della flatlist */}
          <View className="flex flex-row justify-between my-8 items-center">
            <View className="flex flex-row gap-1">
              <ThemedText type="smallBold" themeColor="primary">{memoizedSagre?.length}</ThemedText>
              <ThemedText type="smallBold">sagre vicine</ThemedText>
            </View>
            <ListSwitcher isMap={listType === "map"} setListType={setListType} />
          </View>
          {listType === "list" ?
            <SagreList data={memoizedSagre ?? []} location={location} />
            :
            null
          }
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}