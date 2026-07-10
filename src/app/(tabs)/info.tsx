import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ScrollView } from 'react-native';



export default function InfoScreen() {


  return (
    <ThemedView className='flex-1'>
      <ScrollView>
        <ThemedText type="title">Chi siamo</ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

