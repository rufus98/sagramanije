import z from "zod";

export const Attivita = z.object({
    id: z.number(),
    giorno: z.date(),
    ora_inizio: z.string().nullable(),
    ora_fine: z.string().nullable(),
    titolo: z.string(),
    descrizione: z.string().nullable()
})

export type Attivita = z.infer<typeof Attivita>