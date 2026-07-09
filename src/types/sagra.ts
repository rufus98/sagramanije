import * as z from "zod";

const MESI: Record<string, number> = {
    gennaio: 0, febbraio: 1, marzo: 2, aprile: 3, maggio: 4, giugno: 5,
    luglio: 6, agosto: 7, settembre: 8, ottobre: 9, novembre: 10, dicembre: 11,
};

// Il dataset ha date in formati misti: ISO ("2026-07-08"),
// testo italiano ("24 Aprile 2026") e alcuni null.
// Ritorna sempre mezzanotte locale, così il giorno non slitta di fuso.
function parseData(value: unknown): Date | null {
    if (typeof value !== "string") return null;
    const s = value.trim();

    const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (iso) {
        return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    }

    const it = /^(\d{1,2})\s+([A-Za-zàèéìòù]+)\s+(\d{4})$/.exec(s);
    if (it) {
        const mese = MESI[it[2].toLowerCase()];
        if (mese !== undefined) {
            return new Date(Number(it[3]), mese, Number(it[1]));
        }
    }

    return null;
}

const dataSchema = z.preprocess(parseData, z.date().nullable());

export const Sagra = z.object({
    nome_sagra: z.string(),
    data_inizio: dataSchema,
    data_fine: dataSchema,
    citta: z.string().nullable(),
    provincia: z.string().nullable(),
    lat: z.number(),
    leng: z.number(),
    locandina: z.url().nullable(),
    link_pagina_ufficiale: z.url().nullable(),
    category: z.string(),
    formattedDistance: z.string().nullish()
});

export type Sagra = z.infer<typeof Sagra>;
