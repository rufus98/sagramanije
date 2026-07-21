import { PROGRAMMA_MOCK } from "@/constants/attivita-mock";
import { GiornoAttivita, GiornoAttivitaObj } from "@/types/attivita";
import z from "zod";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL

export const AttivitaGiorni = z.object({
    giorni: z.array(GiornoAttivitaObj)
})

const getAttivitaBySagraId = async (id: number): Promise<GiornoAttivita[]> => {
    const url = `${API_BASE_URL}/sagre/${id}/attivita`

    const response = await fetch(url)

    if(!response.ok) {
        throw new Error(`Richiesta attivita sagra fallita: ${response.status}`)
    }

    const data = await response.json()
    const parsed = AttivitaGiorni.safeParse(data)
    console.log(parsed)
    if(!parsed.success) {
        throw new Error(`Risposta attivita sagra non valida: ${parsed.error.message}`)
    }
    console.log("parsato"+parsed)
    return parsed.data.giorni
}

export const attivitaService = {
    getAttivitaBySagraId
}
