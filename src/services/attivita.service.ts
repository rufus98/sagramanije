import { PROGRAMMA_MOCK } from "@/constants/attivita-mock";
import { GiornoAttivita } from "@/types/attivita";

// TODO: TEMPORANEO — restituisce il dataset mock finché l'endpoint non è pronto.
const getAttivitaBySagraId = (id: number): Promise<GiornoAttivita[]> => {
    return Promise.resolve(PROGRAMMA_MOCK)
}

export const attivitaService = {
    getAttivitaBySagraId
}
