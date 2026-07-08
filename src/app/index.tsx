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
import { useState } from 'react';

export default function HomeScreen() {
  const { data } = useQuery({
    queryKey: ['sagre'],
    queryFn: sagraService.getNearbySagre
  })
  const [listType, setListType] = useState<"list" | "map">("list")

  return (
    <ThemedView className='flex-1 py-3 px-5'>
      <SafeAreaView>
        <IndexHeader />
        <View className="mt-5">
          <FilterTextInput />
        </View>
        <View>
          {/* heading della flatlist */}
          <View className="flex flex-row justify-between my-8 items-center">
            <View className="flex flex-row gap-1">
              <ThemedText type="smallBold" themeColor="primary">{data?.length}</ThemedText>
              <ThemedText type="smallBold">sagre vicine</ThemedText>
            </View>
            <ListSwitcher isMap={listType === "map"} setListType={setListType} />
          </View>
          {listType === "list" ?
            <SagreList data={data ?? []} />
            :
            null
          }
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}