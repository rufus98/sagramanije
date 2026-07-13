import Storage from 'expo-sqlite/kv-store';

// versionata: bumpando la chiave l'onboarding torna a mostrarsi anche a chi
// l'aveva già visto (utile quando si aggiungono slide su feature nuove)
const KEY = 'onboarding-seen-v1';

export const onboardingStorage = {
  // sync: leggiamo al primo render, così non c'è un frame di home prima del carosello
  getSeen: () => Storage.getItemSync(KEY) === 'true',
  setSeen: () => Storage.setItemSync(KEY, 'true'),
};
