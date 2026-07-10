import { BricolageGrotesque_700Bold } from '@expo-google-fonts/bricolage-grotesque';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { SharedTransitionProvider } from '@/context/shared-transition';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KeyboardProvider } from "react-native-keyboard-controller";
import * as SystemUI from 'expo-system-ui';


SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient()

SystemUI.setBackgroundColorAsync('#fff7ee');

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  return (

    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        {fontsLoaded &&
          <SharedTransitionProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="sagra/[id]" options={{ animation: "fade" }} />
            </Stack>
          </SharedTransitionProvider>}
        <AnimatedSplashOverlay appReady={fontsLoaded} />
      </KeyboardProvider>
    </QueryClientProvider>
  );
}
