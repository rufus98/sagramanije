import { Map, MapPin, Megaphone, PartyPopper, type LucideIcon } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { completeOnboarding } from '@/hooks/use-onboarding';
import { useTheme } from '@/hooks/use-theme';
import useUserLocation from '@/hooks/use-user-location';

type Lang = 'it' | 'ab';

type Copy = { title: string; description: string };

type Slide = {
  icon: LucideIcon;
  color: string;
} & Record<Lang, Copy>;

const SLIDES: Slide[] = [
  {
    icon: PartyPopper,
    color: '#ec5a35',
    it: {
      title: 'Le sagre vicine a te',
      description:
        'Tutte le sagre d\'Abruzzo in un posto solo, ordinate da quella che ti costa meno strada.',
    },
    ab: {
      title: 'Li sagr qua vicìn',
      description:
        'Tutt li sagre d\'Abbruzz dentr\'a nu poste sole, méss\'a file da quella che te fa cammenà chiù poc.',
    },
  },
  {
    icon: Map,
    color: '#3c87f7',
    it: {
      title: 'Lista o mappa, come preferisci',
      description:
        'Scorri l\'elenco o guardale sulla mappa, e filtra per distanza per restare nel tuo raggio.',
    },
    ab: {
      title: 'Liste o mappe, com t par',
      description:
        'Scurr l\'elenche o guàrdele sopr\'a la mappe, e filtre pe\' distanze pe\' armanè dentr\'a lu ragg tì.',
    },
  },
  {
    icon: Megaphone,
    color: '#f5a524',
    it: {
      title: 'Manca una sagra?',
      description:
        'Segnalacela dalla scheda Info: la aggiungiamo noi, così la trovano anche gli altri.',
    },
    ab: {
      title: 'T\' amanghe na sagre?',
      description:
        'Dìccele da la schede Info: ce la mettéme nu\', accuscì la trove pure jj\'atre.',
    },
  },
  {
    icon: MapPin,
    color: '#30a46c',
    it: {
      title: 'Attiva la posizione',
      description:
        'Ci serve solo per calcolare quanto distano le sagre da te. Niente account, niente tracciamenti.',
    },
    ab: {
      title: 'Appicce la posizione',
      description:
        'C serv sole pe\' sapé quante stanne luntane le sagre da te. Nd serv l\'account, ndi traccem.',
    },
  },
];

const LABELS: Record<Lang, { skip: string; next: string; enable: string; later: string }> = {
  it: { skip: 'Salta', next: 'Avanti', enable: 'Attiva posizione', later: 'Non ora' },
  ab: { skip: 'Lasse perde', next: 'Avand', enable: 'Appicce la posizione', later: 'Mo\' no' },
};

const LAST = SLIDES.length - 1;

// Segmented control per la lingua dei testi dell'intro.
function LangSwitch({ lang, onChange }: { lang: Lang; onChange: (lang: Lang) => void }) {
  const theme = useTheme();

  return (
    <View className="flex-row rounded-full bg-white p-1">
      {(['it', 'ab'] as const).map((value) => {
        const isActive = value === lang;

        return (
          <Pressable
            key={value}
            onPress={() => onChange(value)}
            className="rounded-full px-3 py-1.5 active:opacity-80"
            style={isActive ? { backgroundColor: theme.primary } : undefined}>
            <ThemedText type="smallBold" style={isActive ? { color: '#fff' } : undefined}>
              {value === 'it' ? 'Italiano' : 'Abruzzese'}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

// Un pallino per slide: quello attivo si allarga e prende il colore primario.
function Dot({ index, scrollX, width }: { index: number; scrollX: { value: number }; width: number }) {
  const theme = useTheme();

  const style = useAnimatedStyle(() => {
    const distance = Math.abs(scrollX.value / width - index);
    return {
      width: interpolate(distance, [0, 1], [24, 8], 'clamp'),
      opacity: interpolate(distance, [0, 1], [1, 0.3], 'clamp'),
    };
  });

  return (
    <Animated.View
      className="h-2 rounded-full"
      style={[{ backgroundColor: theme.primary }, style]}
    />
  );
}

// Carosello di primo avvio. L'ultima slide fa da priming per il permesso di
// posizione: spieghiamo perché serve prima di far comparire il popup di sistema.
export default function OnboardingScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { requestLocation } = useUserLocation();
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);
  const [index, setIndex] = useState(0);
  const [lang, setLang] = useState<Lang>('ab');

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const goNext = () => {
    scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
  };

  // in entrambi i casi l'onboarding si chiude: la guard nel root layout fa il
  // resto e ci porta sulla home
  const finish = async () => {
    await requestLocation();
    completeOnboarding();
  };

  const isLast = index === LAST;
  const labels = LABELS[lang];

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <View className="h-12 flex-row items-center justify-between px-5">
          <LangSwitch lang={lang} onChange={setLang} />
          {!isLast && (
            <Pressable onPress={completeOnboarding} hitSlop={12} className="active:opacity-60">
              <ThemedText type="smallBold" themeColor="textSecondary">
                {labels.skip}
              </ThemedText>
            </Pressable>
          )}
        </View>

        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onMomentumScrollEnd={(event) =>
            setIndex(Math.round(event.nativeEvent.contentOffset.x / width))
          }
          className="flex-1">
          {SLIDES.map(({ icon: Icon, color, ...copy }) => (
            <View
              key={copy.it.title}
              style={{ width }}
              className="flex-1 items-center justify-center px-10">
              <View className="rounded-[40px] p-10" style={{ backgroundColor: `${color}22` }}>
                <Icon color={color} size={72} strokeWidth={1.5} />
              </View>
              <ThemedText type="title" className="mt-12 text-center">
                {copy[lang].title}
              </ThemedText>
              <ThemedText themeColor="textSecondary" className="mt-4 text-center">
                {copy[lang].description}
              </ThemedText>
            </View>
          ))}
        </Animated.ScrollView>

        <View className="flex-row justify-center gap-2 py-8">
          {SLIDES.map((slide, i) => (
            <Dot key={slide.it.title} index={i} scrollX={scrollX} width={width} />
          ))}
        </View>

        <View className="gap-3 px-5">
          <Pressable
            onPress={isLast ? finish : goNext}
            className="items-center rounded-3xl py-4 active:opacity-80"
            style={{ backgroundColor: theme.primary }}>
            <ThemedText className="font-jakarta-bold text-lg" style={{ color: '#fff' }}>
              {isLast ? labels.enable : labels.next}
            </ThemedText>
          </Pressable>

          {/* senza posizione l'app funziona lo stesso, solo senza distanze */}
          <Pressable
            onPress={completeOnboarding}
            className="items-center py-3 active:opacity-60"
            disabled={!isLast}
            style={{ opacity: isLast ? 1 : 0 }}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              {labels.later}
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}
