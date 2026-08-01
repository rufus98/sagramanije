import { Image } from 'expo-image';
import { X } from 'lucide-react-native';
import { Modal, Platform, Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type PosterViewerProps = {
  source: string;
  visible: boolean;
  onClose: () => void;
};

export default function PosterViewer({ source, visible, onClose }: PosterViewerProps) {
  const insets = useSafeAreaInsets();
  const fallbackTop = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 0);
  const closeButtonTop = Math.max(insets.top, fallbackTop) + 12;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#080808" />
      <View className="flex-1 bg-[#080808]">
        <Image
          source={{ uri: source }}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
          transition={150}
          cachePolicy="memory-disk"
          accessible
          accessibilityLabel="Locandina della sagra a schermo intero"
        />

        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Chiudi locandina"
          hitSlop={8}
          className="absolute right-5 rounded-full bg-white/15 p-3 active:opacity-70"
          style={{ top: closeButtonTop }}
        >
          <X color="#fff" size={24} />
        </Pressable>
      </View>
    </Modal>
  );
}
