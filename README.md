# Sagramanije 🎪

App mobile per scoprire le sagre e le feste di paese in Abruzzo. Trova gli eventi più vicini a te, guardali su mappa e fatti portare lì con le indicazioni stradali.

Costruita con [Expo](https://docs.expo.dev/versions/v57.0.0/) (SDK 57), React Native 0.86 ed expo-router.

## Funzionalità

- **Sagre vicine** — l'elenco è ordinato dalla più vicina, in base alla posizione dell'utente (permesso opzionale: senza posizione si vedono comunque tutte le sagre).
- **Filtri** — ricerca per nome o città (con debounce) e filtro per raggio in km.
- **Mappa** — MapLibre con clustering nativo dei pin; il tap su un cluster apre la lista delle sagre in zona, il tap su un pin apre la card con date e pulsante *Indicazioni* verso Google/Apple Maps.
- **Dettaglio sagra** — locandina, descrizione, date, orari e link alla pagina ufficiale, con shared element transition dalla lista.
- **Onboarding** — carosello al primo avvio, con flag persistito e versionato.
- **Segnala una sagra** — modale nella schermata Info per contribuire con eventi mancanti.

## Requisiti

- Node.js 20+
- Per le build native: Android Studio (Android) o Xcode (iOS)
- Un file `.env` nella root con l'URL dell'API:

  ```
  EXPO_PUBLIC_API_BASE_URL=https://<host-api>
  ```

  L'app consuma due endpoint: `GET /sagre/vicine?lat=&leng=&raggio_km=` e `GET /sagre/:id`.

## Come partire

```bash
npm install
npm run dev        # avvia il dev server di Expo
```

L'app usa moduli nativi (MapLibre, expo-sqlite, expo-location) che **non** funzionano su Expo Go: serve una development build.

```bash
npm run android    # expo run:android
npm run ios        # expo run:ios
npm run web        # expo start --web
npm run lint       # expo lint
```

## Struttura del progetto

```
src/
  app/               rotte expo-router (typed routes attive)
    (tabs)/          home (lista + mappa) e info
    sagra/[id].tsx   dettaglio sagra
    onboarding.tsx   carosello primo avvio
  components/        UI, raggruppata per schermata (index/, sagra/, info/, ui/)
  services/          chiamate all'API (sagra.service.ts)
  types/             schema Zod della Sagra + normalizzazione dei dati
  hooks/             posizione utente, onboarding, debounce
  constants/theme.ts colori, spacing, font
```

### Note tecniche

- **Stile**: NativeWind (Tailwind) + `constants/theme.ts`. L'app è solo light mode.
- **Dati**: React Query per fetch e cache; Zod valida ogni risposta.
- **Normalizzazione**: il dataset a monte arriva da scraping HTML, quindi [types/sagra.ts](src/types/sagra.ts) decodifica le entità HTML (`&rsquo;`, `&#8217;`, …) e accetta date in formati misti (ISO e testo italiano tipo "24 Aprile 2026").
- **Storage**: `expo-sqlite/kv-store` per il flag di onboarding (letto in modo sincrono al primo render).
- **React Compiler** e le **typed routes** sono abilitati in [app.json](app.json).

## Build di release (Android)

Le credenziali di firma sono lette da `android/gradle.properties` (`SAGRA_UPLOAD_STORE_FILE`, `SAGRA_UPLOAD_KEY_ALIAS`, …). Il path del keystore è locale alla macchina: va aggiornato prima di buildare su un'altra postazione.
