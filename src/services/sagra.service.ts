import { Sagra } from "@/types/sagra"
import * as z from "zod"
import { apiFetch } from "./api"

export function formatDistance(km: number) {
    if(km < 1) {
        return `${Math.round(km * 1000)} m`
    }
    return `${km.toFixed(2)} km`
}

const NearbyResponse = z.object({
    risultati: z.array(Sagra)
})

// L'endpoint ordina già i risultati dal più vicino.
const getNearbySagre = async ({ lat, lng, raggioKm }: { lat: number | null; lng: number | null; raggioKm?: number }, signal?: AbortSignal): Promise<Sagra[]> => {

    let path = "/sagre/vicine"
    
    if(lat !== null && lng !== null) {
        path+=`?lat=${lat}&leng=${lng}`
        if(raggioKm !== -1) path+= `&raggio_km=${raggioKm}`
    }

    const response = await apiFetch(path, { signal })

    if (!response.ok) {
        throw new Error(`Richiesta sagre vicine fallita: ${response.status}`)
    }

    const data = await response.json()

    const parsed = NearbyResponse.safeParse(data)

    if (!parsed.success) {
        console.error(`Sagre vicine — risposta non valida:\n${z.prettifyError(parsed.error)}`)
        throw parsed.error
    }

    return parsed.data.risultati
}

// TODO: TEMPORANEO — rimuovere quando l'endpoint /sagre/:id è pronto.
// Cerca la sagra nel dataset locale simulando una latenza di rete.
const getById = async (id: string, signal?: AbortSignal): Promise<Sagra> => {
    const response = await apiFetch(`/sagre/${id}`, { signal })

    if (!response.ok) {
        throw new Error(`Richiesta sagre vicine fallita: ${response.status}`)
    }
    const sagra = Sagra.parse(await response.json())

    return sagra
}

export const sagraService = {
    formatDistance,
    getNearbySagre,
    getById
}
