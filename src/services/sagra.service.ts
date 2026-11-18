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

type NearbyOptions = {
    lat: number | null;
    lng: number | null;
    raggioKm?: number;
};

const getNearbySagre = async ({ lat, lng, raggioKm }: NearbyOptions, signal?: AbortSignal): Promise<Sagra[]> => {
    const params = new URLSearchParams();
    if (lat !== null && lng !== null) {
        params.set("lat", String(lat));
        params.set("leng", String(lng));
        if (raggioKm !== undefined && raggioKm > 0) params.set("raggio_km", String(raggioKm));
    }
    const query = params.toString();
    const path = query ? `/sagre/vicine?${query}` : "/sagre/vicine";
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

    return parsed.data.risultati;
}

const resolveSlugToId = async (slug: string, signal?: AbortSignal): Promise<number> => {
    const siteUrl = (process.env.EXPO_PUBLIC_SITE_URL || "https://sagramanije.it").replace(/\/$/, "")

    // 1. Prova prima con l'endpoint dedicato per singolo slug su sagramanije.it
    try {
        const response = await fetch(`${siteUrl}/api/sagra/${encodeURIComponent(slug)}`, { signal })
        if (response.ok) {
            const data = await response.json()
            if (data?.id && typeof data.id === "number") {
                return data.id
            }
        }
    } catch {
        // Fallback sotto
    }

    // 2. Fallback con l'archivio completo già presente su sagramanije.it
    try {
        const response = await fetch(`${siteUrl}/api/archivio`, { signal })
        if (response.ok) {
            const data = await response.json()
            const found = data?.sagre?.find((s: { slug?: string; id?: number }) => s.slug === slug)
            if (found?.id && typeof found.id === "number") {
                return found.id
            }
        }
    } catch (error) {
        console.error("Errore durante la risoluzione dello slug:", error)
    }

    throw new Error(`Nessuna sagra trovata per lo slug "${slug}"`)
}

// Cerca la sagra per ID numerico o per slug (es. da deep link web: /sagra/slug-della-sagra).
const getById = async (idOrSlug: string, signal?: AbortSignal): Promise<Sagra> => {
    let id = idOrSlug

    if (!/^\d+$/.test(idOrSlug)) {
        const resolvedId = await resolveSlugToId(idOrSlug, signal)
        id = String(resolvedId)
    }

    const response = await apiFetch(`/sagre/${id}`, { signal })

    if (!response.ok) {
        throw new Error(`Richiesta sagra fallita: ${response.status}`)
    }
    const sagra = Sagra.parse(await response.json())

    return sagra
}

export const sagraService = {
    formatDistance,
    getNearbySagre,
    getById,
    resolveSlugToId,
}

