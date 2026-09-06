import { PROGRAMMA_MOCK } from "@/constants/attivita-mock";
import { GiornoAttivita, GiornoAttivitaObj } from "@/types/attivita";
import z from "zod";
import { apiFetch } from "./api";
import { sagraService } from "./sagra.service";

export const AttivitaGiorni = z.object({
    giorni: z.array(GiornoAttivitaObj)
})

const getAttivitaBySagraId = async (idOrSlug: number | string, signal?: AbortSignal): Promise<GiornoAttivita[]> => {
    let id = idOrSlug
    if (typeof idOrSlug === "string" && !/^\d+$/.test(idOrSlug)) {
        id = await sagraService.resolveSlugToId(idOrSlug, signal)
    }

    const response = await apiFetch(`/sagre/${id}/attivita`, { signal })

    if(!response.ok) {
        throw new Error(`Richiesta attivita sagra fallita: ${response.status}`)
    }

    const data = await response.json()
    const parsed = AttivitaGiorni.safeParse(data)
    if(!parsed.success) {
        throw new Error(`Risposta attivita sagra non valida: ${parsed.error.message}`)
    }
    return parsed.data.giorni
}

export const attivitaService = {
    getAttivitaBySagraId
}
