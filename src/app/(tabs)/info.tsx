import { FeatureCard } from '@/components/info/feature-card';
import { ContactCard, ContactRow } from '@/components/info/contact-card';
import { ReportSagraModal } from '@/components/info/report-sagra-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { ChevronRight, Info, Mail, MapPin, PlusCircle, Star } from 'lucide-react-native';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InfoScreen() {
  const [reportVisible, setReportVisible] = useState(false);

  return (
    <ThemedView className="flex-1">
      <SafeAreaView>
        <ScrollView className="px-5 pt-3" showsVerticalScrollIndicator={false}>
          <ThemedText type="title">Chi siamo</ThemedText>
          <ThemedText className="mt-2" themeColor="textSecondary">
            <ThemedText className="font-bold">Sagramanije</ThemedText> nasce dalla voglia di riportare la
            gente nelle piazze. Mappiamo migliaia di sagre e feste di paese in tutta Abruzzo, così puoi
            scoprire porchetta, vino, musica e tradizioni a due passi da casa.
          </ThemedText>

          <View className="mt-6 gap-4">
            <FeatureCard
              icon={MapPin}
              color={Colors.primary}
              title="Tutt l'Abbruzz, in tempo reale"
              description="Date, orari e luoghi aggiornati direttamente dalle pro loco."
            />
            <FeatureCard
              icon={Star}
              color="#3f9d6b"
              title="Il gusto della tradizione"
              description="Scegliamo solo eventi autentici, niente turismo di plastica."
            />
            <FeatureCard
              icon={Info}
              color="#3c87f7"
              title="Sempre gratis"
              description="Cercare e scoprire sagre non costa nulla, per tutti."
            />
          </View>

          <ThemedText type="subtitle" className="mt-8 mb-4">
            Contatti
          </ThemedText>
          <ContactCard>
            <ContactRow
              icon={Mail}
              label="Email"
              value="sagramanije@gmail.com"
              onPress={() => Linking.openURL('mailto:sagramanije@gmail.com')}
            />
          </ContactCard>

          <ThemedText type="subtitle" className="mt-8 mb-4">
            Contribuisci
          </ThemedText>
          <Pressable
            onPress={() => setReportVisible(true)}
            className="flex-row items-center gap-4 rounded-3xl bg-white p-5 active:opacity-80"
          >
            <View className="rounded-2xl p-4" style={{ backgroundColor: `${Colors.primary}22` }}>
              <PlusCircle color={Colors.primary} size={26} strokeWidth={1.75} />
            </View>
            <View className="flex-1">
              <ThemedText className="font-title text-lg">Segnalaci una sagra</ThemedText>
              <ThemedText type="small" themeColor="textSecondary" className="mt-1">
                Manca una sagra dalla mappa? Aiutaci ad aggiungerla.
              </ThemedText>
            </View>
            <ChevronRight color={Colors.textSecondary} size={22} />
          </Pressable>

          <View className="h-10" />
        </ScrollView>
      </SafeAreaView>

      <ReportSagraModal visible={reportVisible} onClose={() => setReportVisible(false)} />
    </ThemedView>
  );
}
