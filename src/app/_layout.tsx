import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';

import { SharedTransitionProvider } from '@/context/shared-transition';
import { useHasSeenOnboarding } from '@/hooks/use-onboarding';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar, View } from 'react-native';


// senza questo lo splash nativo sparisce appena si attacca la RootView, cioè
// prima che il JS abbia disegnato: sotto resta il vuoto (nero) finché il
// bundle non e' pronto. Lo teniamo su fino al primo layout dell'albero.
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ fade: true, duration: 300 });

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
        <StatusBar barStyle={"dark-content"} />
        <SharedTransitionProvider>
          <View style={{ flex: 1 }} onLayout={() => SplashScreen.hideAsync()}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Protected guard={hasSeenOnboarding}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="sagra/[id]" options={{ animation: "fade" }} />
                <Stack.Screen name="sagra/[id]/attivita" options={{ animation: "fade" }} />
              </Stack.Protected>
              <Stack.Protected guard={!hasSeenOnboarding}>
                <Stack.Screen name="onboarding" />
              </Stack.Protected>
            </Stack>
          </View>
        </SharedTransitionProvider>
      </KeyboardProvider>
    </QueryClientProvider>
  );
}
