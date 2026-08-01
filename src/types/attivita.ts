import z from "zod";

export const Attivita = z.object({
    id: z.number(),
    giorno: z.coerce.date(),
    ora_inizio: z.string().nullable(),
    ora_fine: z.string().nullable(),
    titolo: z.string(),
    descrizione: z.string().nullable()
})

export type Attivita = z.infer<typeof Attivita>

export const GiornoAttivitaObj = z.object({
    giorno: z.coerce.date(),
    attivita: z.array(Attivita)
})

export type GiornoAttivita = z.infer<typeof GiornoAttivitaObj>