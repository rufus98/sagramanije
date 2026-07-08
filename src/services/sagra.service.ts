import * as z from "zod"
import { Sagra } from "@/types/sagra"

// TODO: TEMPORANEO — rimuovere quando l'endpoint /nearby è pronto.
// Usa il dataset locale come mock.
const getNearbySagre = async (): Promise<Sagra[]> => {
    const dataset = (await import("@/dataset/sagre_italia.json")).default
    return z.array(Sagra).parse(dataset).slice(0, 50)
}

export const sagraService = {
    getNearbySagre
}
