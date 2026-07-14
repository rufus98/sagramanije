import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { SharedTransitionProvider } from '@/context/shared-transition';
import { useHasSeenOnboarding } from '@/hooks/use-onboarding';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KeyboardProvider } from "react-native-keyboard-controller";


SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient()

SystemUI.setBackgroundColorAsync('#fff7ee');

export default function RootLayout() {
  // al primo avvio le rotte dell'app sono spente: expo-router ripiega
  // sull'onboarding, e quando il flag diventa true riporta alla home
  // svuotando la history (niente back verso il carosello)
  const hasSeenOnboarding = useHasSeenOnboarding();

  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        <SharedTransitionProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={hasSeenOnboarding}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="sagra/[id]" options={{ animation: "fade" }} />
            </Stack.Protected>
            <Stack.Protected guard={!hasSeenOnboarding}>
              <Stack.Screen name="onboarding" />
            </Stack.Protected>
          </Stack>
        </SharedTransitionProvider>
        <AnimatedSplashOverlay appReady={true} />
      </KeyboardProvider>
    </QueryClientProvider>
  );
}
