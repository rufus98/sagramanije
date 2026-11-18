import type { ReactNode } from 'react';
import { MapPin } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mapUtils, type MapDestination } from '@/utils/map-utils';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import BackButton from './back-button';
import SagraHero from './sagra-hero';
import ShareButton, { type EventShare } from './share-button';

type EventDetailProps = {
  poster?: string | null;
  fallbackCover?: number;
  actionColor?: string;
  actions?: { destination: MapDestination; share: EventShare };
  children: ReactNode;
};

export default function EventDetail({ poster, fallbackCover, actionColor, actions, children }: EventDetailProps) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1">
      <SagraHero source={poster} fallbackCover={fallbackCover} />
      <BackButton />
      <ThemedView className="rounded-3xl -mt-12 flex-1 pt-3">{children}</ThemedView>
      {actions && (
        <ThemedView className="px-4 pt-4 flex-row gap-3" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
          <ShareButton {...actions.share} />
          <TouchableOpacity accessibilityRole="button" onPress={() => mapUtils.openDirections(actions.destination)}
            style={actionColor ? { backgroundColor: actionColor, shadowColor: actionColor } : undefined}
            className="flex-1 py-4 bg-primary rounded-3xl flex-row gap-3 items-center justify-center shadow-xl shadow-primary/20">
            <MapPin color="#fff" />
            <ThemedText className="font-bold font-title" style={{ color: '#fff' }}>Come arrivare</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </View>
  );
}
