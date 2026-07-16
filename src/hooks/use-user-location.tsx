import { useCallback, useEffect, useState } from "react";
import { AppState, Linking } from "react-native";
import { Accuracy, getCurrentPositionAsync, getLastKnownPositionAsync, hasServicesEnabledAsync, reverseGeocodeAsync, useForegroundPermissions } from 'expo-location';

export type LocationInfo = {
    citta: string | null;
    provincia: string | null;
};

export type Coords = {
    lat: number; lng: number,
    locationInfo: LocationInfo | null
} | null;

export default function useUserLocation() {
    const [permission, requestPermission] = useForegroundPermissions();
    const [location, setLocation] = useState<Coords>(null);
    const [locationError, setLocationError] = useState(false);

    const fetchLocation = useCallback(async () => {
        try {
            setLocationError(false);

            // se l'utente ha spento i servizi di localizzazione (GPS di sistema)
            // getCurrentPositionAsync fallirebbe: meglio accorgersene subito e
            // mostrare un errore invece di restare su "Recupero posizione…"
            if (!(await hasServicesEnabledAsync())) {
                setLocationError(true);
                return;
            }

            // su Android getCurrentPositionAsync può restare appeso a lungo
            // (emulatore senza posizione, GPS lento): proviamo prima l'ultima
            // posizione nota, che ritorna subito se disponibile
            let pos = await getLastKnownPositionAsync();
            if (!pos) {
                pos = await getCurrentPositionAsync({ accuracy: Accuracy.Balanced });
            }

            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            // reverse geocode: da coordinate a città/provincia
            let locationInfo: LocationInfo | null = null;
            try {
                const [place] = await reverseGeocodeAsync({ latitude: lat, longitude: lng });
                if (place) {
                    locationInfo = {
                        citta: place.city,
                        provincia: place.subregion, // in Italia la provincia è subregion, non region
                    };
                }
            } catch {
                // se il reverse geocode fallisce teniamo comunque le coordinate
            }

            setLocation({ lat, lng, locationInfo });
        } catch (e) {
            // altrimenti l'errore verrebbe inghiottito in silenzio e lo screen
            // resterebbe bloccato su "Recupero posizione…"
            console.warn('fetchLocation fallita', e);
            setLocationError(true);
        }
    }, []);

    // quando ho il permesso prendo la posizione
    useEffect(() => {
        if (permission?.granted) fetchLocation();
    }, [permission?.granted]);

    // se l'utente esce (es. per riattivare il GPS dalle impostazioni) e rientra
    // in app riprovo da solo, così non resta bloccato sull'errore
    useEffect(() => {
        const sub = AppState.addEventListener('change', (state) => {
            if (state === 'active' && permission?.granted && !location) fetchLocation();
        });
        return () => sub.remove();
    }, [permission?.granted, location, fetchLocation]);

    // chiamare per richiedere la posizione
    const requestLocation = useCallback(async () => {
        // non leggo `permission` in cache per decidere se mostrare il popup (può
        // essere null al mount o stale dopo un "chiedi ogni volta" scaduto):
        // requestPermission ritorna sempre lo stato aggiornato.
        const wasGranted = permission?.granted;
        const current = await requestPermission();

        if (current.granted) {
            // se era già concesso l'effect non riscatta (granted non cambia):
            // faccio io il fetch. Se è appena stato concesso ci pensa l'effect,
            // così evito la doppia chiamata.
            if (wasGranted) fetchLocation();
            return;
        }
        if (!current.canAskAgain) {
            // ha rifiutato in modo permanente: unica via sono le impostazioni
            Linking.openSettings();
        }
    }, [permission?.granted, requestPermission, fetchLocation]);

    return { location, locationError, permission, requestLocation };
}
