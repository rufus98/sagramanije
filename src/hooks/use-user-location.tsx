import { useCallback, useEffect, useRef, useState } from "react";
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

// da coordinate a città/provincia; se fallisce teniamo comunque le coordinate
async function reverseGeocode(latitude: number, longitude: number): Promise<LocationInfo | null> {
    try {
        const [place] = await reverseGeocodeAsync({ latitude, longitude });
        // in Italia la provincia è subregion, non region
        return place ? { citta: place.city, provincia: place.subregion } : null;
    } catch {
        return null;
    }
}

// a freddo getCurrentPositionAsync può restare appeso a lungo (emulatore senza
// posizione, GPS lento): l'ultima posizione nota ritorna subito. Se i servizi
// sono spenti la saltiamo, sarebbe stantia.
// `mayShowUserSettingsDialog` segue `interactive`: il dialog Android per
// riaccendere il GPS deve comparire solo dietro un tap dell'utente.
async function getPosition(servicesOn: boolean, interactive: boolean) {
    const known = servicesOn ? await getLastKnownPositionAsync() : null;
    return known ?? getCurrentPositionAsync({
        accuracy: Accuracy.Balanced,
        mayShowUserSettingsDialog: interactive,
    });
}

export default function useUserLocation() {
    const [permission, requestPermission] = useForegroundPermissions();
    const [location, setLocation] = useState<Coords>(null);
    const [locationError, setLocationError] = useState(false);
    // evita fetch sovrapposte (es. AppState che cambia mentre una è in corso)
    const fetching = useRef(false);

    // `interactive` = la fetch nasce da un tap dell'utente
    const fetchLocation = useCallback(async (interactive = false) => {
        if (fetching.current) return;
        fetching.current = true;
        try {
            setLocationError(false);

            const servicesOn = await hasServicesEnabledAsync();
            // GPS spento e nessun tap alle spalle: stato di errore (col bottone
            // "riprova") senza dialog, che al rientro in app si ripresenterebbe
            // in loop innescato dal listener AppState qui sotto
            if (!servicesOn && !interactive) {
                setLocationError(true);
                return;
            }

            const pos = await getPosition(servicesOn, interactive);
            const { latitude: lat, longitude: lng } = pos.coords;
            setLocation({ lat, lng, locationInfo: await reverseGeocode(lat, lng) });
        } catch (e) {
            // altrimenti l'errore verrebbe inghiottito e lo screen resterebbe
            // bloccato su "Recupero posizione…"
            console.warn('fetchLocation fallita', e);
            setLocationError(true);
        } finally {
            fetching.current = false;
        }
    }, []);

    // quando ho il permesso prendo la posizione
    useEffect(() => {
        if (permission?.granted) fetchLocation();
    }, [permission?.granted]);

    // se l'utente esce (es. per riattivare il GPS dalle impostazioni) e rientra
    // riprovo da solo, ma solo a servizi accesi: altrimenti ogni rientro
    // ripartirebbe con una fetch destinata a fallire
    useEffect(() => {
        const sub = AppState.addEventListener('change', async (state) => {
            if (state !== 'active' || !permission?.granted || location) return;
            if (await hasServicesEnabledAsync()) fetchLocation();
        });
        return () => sub.remove();
    }, [permission?.granted, location, fetchLocation]);

    // chiamare per richiedere la posizione
    const requestLocation = useCallback(async () => {
        // non leggo `permission` in cache per decidere se mostrare il popup (può
        // essere null al mount o stale dopo un "chiedi ogni volta" scaduto):
        // requestPermission ritorna sempre lo stato aggiornato
        const wasGranted = permission?.granted;
        const { granted, canAskAgain } = await requestPermission();

        if (granted) {
            // se era già concesso l'effect non riscatta (granted non cambia):
            // fetch io, interattiva così il dialog GPS può comparire. Se è
            // appena stato concesso ci pensa l'effect, evito la doppia chiamata
            if (wasGranted) fetchLocation(true);
        } else if (!canAskAgain) {
            // rifiuto permanente: unica via sono le impostazioni
            Linking.openSettings();
        }
    }, [permission?.granted, requestPermission, fetchLocation]);

    return { location, locationError, permission, requestLocation };
}
