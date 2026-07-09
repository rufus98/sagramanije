import * as z from "zod"
import { Sagra } from "@/types/sagra"

export function formatDistance(km: number) {
    if(km < 1) {
        return `${Math.round(km * 1000)} m`
    }
    return `${km.toFixed(2)} km`
}

// Distanza in km tra due punti (haversine).
export function calculateKmDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // raggio terrestre in km
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
    return 2 * R * Math.asin(Math.sqrt(a))
}

// TODO: TEMPORANEO — rimuovere quando l'endpoint /nearby è pronto.
// Usa il dataset locale come mock.
const getNearbySagre = async ({ lat, lng }: { lat: number | null; lng: number | null }): Promise<Sagra[]> => {
    const dataset = (await import("@/dataset/sagre_italia.json")).default
    const sagre = z.array(Sagra).parse(dataset)

    // Senza posizione: nessun ordinamento per distanza, torniamo il dataset così com'è.
    if (lat == null || lng == null) {
        return sagre.slice(0, 50)
    }

    // Con posizione: ordiniamo dalla più vicina e prendiamo le prime 50.
    return sagre
        .map(sagra => ({ sagra, dist: calculateKmDistance(lat, lng, sagra.lat, sagra.leng) }))
        .sort((a, b) => a.dist - b.dist)
        .map(({ sagra }) => sagra)
}

export const sagraService = {
    formatDistance,
    calculateKmDistance,
    getNearbySagre
}
