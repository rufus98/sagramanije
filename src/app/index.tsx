import { SafeAreaView } from 'react-native-safe-area-context';

import IndexHeader from '@/components/index/header';
import SagreList from '@/components/index/sagre-list';
import { ThemedView } from '@/components/themed-view';
import { FilterTextInput } from '@/components/ui/text-input';
import { View } from 'react-native';

export default function HomeScreen() {
  return (
    <ThemedView className='flex-1 py-3 px-5'>
      <SafeAreaView>
        <IndexHeader />
        <View className="mt-5">
          <FilterTextInput />
        </View>
        <View>
          <SagreList />
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}