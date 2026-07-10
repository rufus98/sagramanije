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

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

const NearbyResponse = z.object({
    risultati: z.array(Sagra)
})

// L'endpoint ordina già i risultati dal più vicino.
const getNearbySagre = async ({ lat, lng, raggioKm = 100 }: { lat: number | null; lng: number | null; raggioKm?: number }): Promise<Sagra[]> => {
    // "vicine" non ha senso senza coordinate: senza permesso posizione non c'è nulla da chiedere.
    if (lat == null || lng == null) {
        return []
    }


    const url = `${API_BASE_URL}/sagre/vicine?lat=${lat}&leng=${lng}&raggio_km=${raggioKm}`
    console.log(url)
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Richiesta sagre vicine fallita: ${response.status}`)
    }

    return NearbyResponse.parse(await response.json()).risultati
}

// TODO: TEMPORANEO — rimuovere quando l'endpoint /sagre/:id è pronto.
// Cerca la sagra nel dataset locale simulando una latenza di rete.
const getById = async (id: string): Promise<Sagra | null> => {
    await new Promise(resolve => setTimeout(resolve, 300))

    const dataset = (await import("@/dataset/sagre_italia.json")).default
    const sagre = z.array(Sagra).parse(dataset)

    return sagre.find(sagra => sagra.id === id) ?? null
}

export const sagraService = {
    formatDistance,
    calculateKmDistance,
    getNearbySagre,
    getById
}
