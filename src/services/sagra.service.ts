import { Sagra } from "@/types/sagra"
import * as z from "zod"

export function formatDistance(km: number) {
    if(km < 1) {
        return `${Math.round(km * 1000)} m`
    }
    return `${km.toFixed(2)} km`
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

const NearbyResponse = z.object({
    risultati: z.array(Sagra)
})

// L'endpoint ordina già i risultati dal più vicino.
const getNearbySagre = async ({ lat, lng, raggioKm }: { lat: number | null; lng: number | null; raggioKm?: number }): Promise<Sagra[]> => {

    let url = `${API_BASE_URL}/sagre/vicine`
    
    if(lat && lng) {
        url+=`?lat=${lat}&leng=${lng}`
        if(raggioKm !== -1) url+= `&raggio_km=${raggioKm}`
    }

    console.log(url)
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Richiesta sagre vicine fallita: ${response.status}`)
    }

    return NearbyResponse.parse(await response.json()).risultati
}

// TODO: TEMPORANEO — rimuovere quando l'endpoint /sagre/:id è pronto.
// Cerca la sagra nel dataset locale simulando una latenza di rete.
const getById = async (id: string): Promise<Sagra> => {
    let url = `${API_BASE_URL}/sagre/${id}`
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Richiesta sagre vicine fallita: ${response.status}`)
    }

    const sagra = Sagra.parse(response)

    return sagra
}

export const sagraService = {
    formatDistance,
    getNearbySagre,
    getById
}
