import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { SharedTransitionProvider } from '@/context/shared-transition';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KeyboardProvider } from "react-native-keyboard-controller";


SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient()

SystemUI.setBackgroundColorAsync('#fff7ee');

export default function RootLayout() {

  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        <SharedTransitionProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="sagra/[id]" options={{ animation: "fade" }} />
          </Stack>
        </SharedTransitionProvider>
        <AnimatedSplashOverlay appReady={true} />
      </KeyboardProvider>
    </QueryClientProvider>
  );
}
