import { FeatureCard } from '@/components/info/feature-card';
import { ContactCard, ContactRow } from '@/components/info/contact-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { Info, Mail, MapPin, Phone, Star } from 'lucide-react-native';
import { Linking, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InfoScreen() {
  return (
    <ThemedView className="flex-1">
      <SafeAreaView>
        <ScrollView className="px-5 pt-3" showsVerticalScrollIndicator={false}>
          <ThemedText type="title">Chi siamo</ThemedText>
          <ThemedText className="mt-2" themeColor="textSecondary">
            <ThemedText className="font-bold">Sagramanije</ThemedText> nasce dalla voglia di riportare la
            gente nelle piazze. Mappiamo migliaia di sagre e feste di paese in tutta Italia, così puoi
            scoprire porchetta, vino, musica e tradizioni a due passi da casa.
          </ThemedText>

          <View className="mt-6 gap-4">
            <FeatureCard
              icon={MapPin}
              color={Colors.primary}
              title="Tutta Italia, in tempo reale"
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
              onPress={() => Linking.openURL('mailto:ciao@sagra.app')}
            />
          </ContactCard>

          <View className="h-10" />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}
