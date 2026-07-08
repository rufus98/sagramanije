import * as z from "zod";

const Sagra = z.object({
    nome_sagra: z.string(),
    data_inizio: z.string(),
    data_fine: z.string(),
    citta: z.string(),
    provincia: z.string(),
    lat: z.number(),
    leng: z.number(),
    locandina: z.url(),
    link_pagina_ufficiale: z.url().nullable(),
    category: z.string()
})

export type Sagra = z.infer<typeof Sagra>