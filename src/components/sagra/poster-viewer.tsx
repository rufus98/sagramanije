import { Image } from 'expo-image';
import { X } from 'lucide-react-native';
import { useEffect } from 'react';
import { Modal, Platform, Pressable, StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { cssInterop } from 'nativewind';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

cssInterop(GestureHandlerRootView, { className: 'style' });

const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;

function clamp(value: number, min: number, max: number) {
  'worklet';
  return Math.min(Math.max(value, min), max);
}

function getMaxOffset(contentSize: number, viewportSize: number, scale: number) {
  'worklet';
  return Math.max(0, (contentSize * scale - viewportSize) / 2);
}

type PosterViewerProps = {
  source: string;
  visible: boolean;
  onClose: () => void;
};

export default function PosterViewer({ source, visible, onClose }: PosterViewerProps) {
  const insets = useSafeAreaInsets();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const fallbackTop = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight ?? 0);
  const closeButtonTop = Math.max(insets.top, fallbackTop) + 12;

  const scale = useSharedValue(1);
  const pinchStartScale = useSharedValue(1);
  const pinchStartX = useSharedValue(0);
  const pinchStartY = useSharedValue(0);
  const pinchFocalX = useSharedValue(0);
  const pinchFocalY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const panStartX = useSharedValue(0);
  const panStartY = useSharedValue(0);
  const fittedImageWidth = useSharedValue(screenWidth);
  const fittedImageHeight = useSharedValue(screenHeight);

  const resetImage = (animated = true) => {
    scale.value = animated ? withSpring(1) : 1;
    translateX.value = animated ? withSpring(0) : 0;
    translateY.value = animated ? withSpring(0) : 0;
    fittedImageWidth.value = screenWidth;
    fittedImageHeight.value = screenHeight;
  };

  useEffect(() => {
    resetImage(false);
  }, [source, visible]);

  const pinchGesture = Gesture.Pinch()
    .onStart((event) => {
      pinchStartScale.value = scale.value;
      pinchStartX.value = translateX.value;
      pinchStartY.value = translateY.value;
      pinchFocalX.value = event.focalX - screenWidth / 2;
      pinchFocalY.value = event.focalY - screenHeight / 2;
    })
    .onUpdate((event) => {
      const nextScale = clamp(pinchStartScale.value * event.scale, 1, MAX_SCALE);
      const scaleRatio = nextScale / pinchStartScale.value;
      const maxX = getMaxOffset(fittedImageWidth.value, screenWidth, nextScale);
      const maxY = getMaxOffset(fittedImageHeight.value, screenHeight, nextScale);

      scale.value = nextScale;
      translateX.value = clamp(
        pinchStartX.value + pinchFocalX.value * (1 - scaleRatio),
        -maxX,
        maxX,
      );
      translateY.value = clamp(
        pinchStartY.value + pinchFocalY.value * (1 - scaleRatio),
        -maxY,
        maxY,
      );
    })
    .onEnd(() => {
      const maxX = getMaxOffset(fittedImageWidth.value, screenWidth, scale.value);
      const maxY = getMaxOffset(fittedImageHeight.value, screenHeight, scale.value);

      translateX.value = withSpring(clamp(translateX.value, -maxX, maxX));
      translateY.value = withSpring(clamp(translateY.value, -maxY, maxY));
    });

  const panGesture = Gesture.Pan()
    .maxPointers(1)
    .onBegin(() => {
      panStartX.value = translateX.value;
      panStartY.value = translateY.value;
    })
    .onUpdate((event) => {
      if (scale.value <= 1) {
        return;
      }

      const maxX = getMaxOffset(fittedImageWidth.value, screenWidth, scale.value);
      const maxY = getMaxOffset(fittedImageHeight.value, screenHeight, scale.value);

      translateX.value = clamp(panStartX.value + event.translationX, -maxX, maxX);
      translateY.value = clamp(panStartY.value + event.translationY, -maxY, maxY);
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((event, success) => {
      if (!success) {
        return;
      }

      const zoomingOut = scale.value > 1;
      const nextScale = zoomingOut ? 1 : DOUBLE_TAP_SCALE;
      const maxX = getMaxOffset(fittedImageWidth.value, screenWidth, nextScale);
      const maxY = getMaxOffset(fittedImageHeight.value, screenHeight, nextScale);

      scale.value = withSpring(nextScale);
      translateX.value = withSpring(
        zoomingOut ? 0 : clamp((screenWidth / 2 - event.x) * (nextScale - 1), -maxX, maxX),
      );
      translateY.value = withSpring(
        zoomingOut ? 0 : clamp((screenHeight / 2 - event.y) * (nextScale - 1), -maxY, maxY),
      );
    });

  const imageGesture = Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleClose = () => {
    resetImage(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#080808" translucent />
      <View className="flex-1 bg-[#080808]">
        <GestureHandlerRootView className="flex-1 bg-[#080808]">
          <GestureDetector gesture={imageGesture}>
            <Animated.View style={[StyleSheet.absoluteFill, imageStyle]}>
              <Image
                source={{ uri: source }}
                style={StyleSheet.absoluteFill}
                contentFit="contain"
                transition={150}
                cachePolicy="memory-disk"
                onLoad={({ source: image }) => {
                  const imageRatio = image.width / image.height;
                  const screenRatio = screenWidth / screenHeight;

                  if (imageRatio > screenRatio) {
                    fittedImageWidth.value = screenWidth;
                    fittedImageHeight.value = screenWidth / imageRatio;
                  } else {
                    fittedImageWidth.value = screenHeight * imageRatio;
                    fittedImageHeight.value = screenHeight;
                  }
                }}
                accessible
                accessibilityLabel="Locandina della sagra a schermo intero"
                accessibilityHint="Pizzica o tocca due volte per ingrandire, trascina per spostare"
              />
            </Animated.View>
          </GestureDetector>

          <Pressable
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel="Chiudi locandina"
            hitSlop={8}
            className="absolute right-5 z-10 rounded-full bg-black/65 border border-white/20 p-3 active:opacity-70"
            style={{ top: closeButtonTop }}
          >
            <X color="#fff" size={24} />
          </Pressable>
        </GestureHandlerRootView>
      </View>
    </Modal>
  );
}

