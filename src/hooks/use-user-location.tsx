import { useCallback, useEffect, useState } from "react";
import { Linking } from "react-native";
import { getCurrentPositionAsync, reverseGeocodeAsync, useForegroundPermissions } from 'expo-location';

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

    const fetchLocation = useCallback(async () => {
        const pos = await getCurrentPositionAsync();
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

        console.log(locationInfo)
        setLocation({ lat, lng, locationInfo });
    }, []);

    // quando ho il permesso prendo la posizione
    useEffect(() => {
        if (permission?.granted) fetchLocation();
    }, [permission?.granted]);

    // chiamare per richiedere la posizione
    const requestLocation = useCallback(async () => {
        if (permission?.granted) {
            fetchLocation();
            return;
        }
        if (permission?.canAskAgain) {
            // possiamo ancora mostrare il popup di sistema
            await requestPermission();
            return;
        }
        // se ha rifiutato in precedenza lo rimando alle impostazioni
        Linking.openSettings();
    }, [permission]);

    return { location, permission, requestLocation };
}
