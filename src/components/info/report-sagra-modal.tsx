import { useState } from 'react';
import { X } from 'lucide-react-native';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import { useTheme } from '@/hooks/use-theme';

type ReportSagraModalProps = {
  visible: boolean;
  onClose: () => void;
};

type Field = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  multiline?: boolean;
};

// Campo di testo con etichetta, usato nel form di segnalazione.
function LabeledInput({ label, value, onChangeText, placeholder, multiline }: Field) {
  const theme = useTheme();

  return (
    <View>
      <ThemedText type="smallBold" className="mb-2">
        {label}
      </ThemedText>
      <TextInput
        className="rounded-3xl bg-white px-5 py-4 text-xl font-jakarta-medium"
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        style={{ color: theme.text, minHeight: multiline ? 120 : undefined }}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

// Modal a schermo intero per segnalare una sagra non ancora presente in app.
// Tutti i campi sono opzionali.
export function ReportSagraModal({ visible, onClose }: ReportSagraModalProps) {
  const theme = useTheme();
  const [nome, setNome] = useState('');
  const [indirizzo, setIndirizzo] = useState('');
  const [descrizione, setDescrizione] = useState('');

  const reset = () => {
    setNome('');
    setIndirizzo('');
    setDescrizione('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    const body = [
      `Nome: ${nome.trim() || '—'}`,
      `Indirizzo: ${indirizzo.trim() || '—'}`,
      `Descrizione: ${descrizione.trim() || '—'}`,
    ].join('\n');

    const url = `mailto:sagramanije@gmail.com?subject=${encodeURIComponent(
      'Segnalazione sagra'
    )}&body=${encodeURIComponent(body)}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) throw new Error('no mail client');
      await Linking.openURL(url);
      handleClose();
    } catch {
      Alert.alert(
        'Impossibile aprire l\'email',
        'Nessuna app di posta configurata. Scrivici a sagramanije@gmail.com.'
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <ThemedView className="flex-1">
        <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
          <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
            <ThemedText type="subtitle">Segnala una sagra</ThemedText>
            <Pressable
              onPress={handleClose}
              hitSlop={12}
              className="rounded-full bg-white p-2"
            >
              <X color={theme.text} size={22} strokeWidth={2} />
            </Pressable>
          </View>

          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              className="px-5"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <ThemedText themeColor="textSecondary" className="mb-6">
                Manca una sagra? Aiutaci a mapparla. Compila quello che sai, ci pensiamo noi al
                resto. <ThemedText className="font-jakarta-bold">Tutti i campi sono opzionali.</ThemedText>
              </ThemedText>

              <View className="gap-5">
                <LabeledInput
                  label="Nome"
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Es. Sagra della porchetta"
                />
                <LabeledInput
                  label="Indirizzo"
                  value={indirizzo}
                  onChangeText={setIndirizzo}
                  placeholder="Es. Piazza del Popolo, Roma"
                />
                <LabeledInput
                  label="Descrizione"
                  value={descrizione}
                  onChangeText={setDescrizione}
                  placeholder="Racconta com'è, quando si tiene, cosa si mangia..."
                  multiline
                />
              </View>

              <View className="h-8" />
            </ScrollView>
          </KeyboardAvoidingView>

          <View className="px-5 pt-3">
            <Pressable
              onPress={handleSubmit}
              className="items-center rounded-3xl py-4 active:opacity-80"
              style={{ backgroundColor: theme.primary }}
            >
              <ThemedText className="font-jakarta-bold text-lg" style={{ color: '#fff' }}>
                Invia segnalazione
              </ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ThemedView>
    </Modal>
  );
}
