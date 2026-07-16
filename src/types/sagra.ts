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

// Il dataset arriva da HTML: i testi contengono entità (&rsquo;, &amp;, &#8217;).
const ENTITA: Record<string, string> = {
    rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“",
    amp: "&", quot: '"', apos: "'", lt: "<", gt: ">",
    nbsp: " ", hellip: "…", ndash: "–", mdash: "—",
    agrave: "à", egrave: "è", eacute: "é", igrave: "ì", ograve: "ò", ugrave: "ù",
};

// Il ";" è opzionale: alcuni valori sono troncati (es. "Sant&rsquo").
function decodeEntita(s: string): string {
    return s.replace(/&(#x?[0-9a-f]+|[a-z]+);?/gi, (match, corpo: string) => {
        if (corpo[0] === "#") {
            const code = corpo[1].toLowerCase() === "x"
                ? parseInt(corpo.slice(2), 16)
                : parseInt(corpo.slice(1), 10);
            return Number.isFinite(code) ? String.fromCodePoint(code) : match;
        }
        return ENTITA[corpo.toLowerCase()] ?? match;
    });
}

const testo = z.string().transform(decodeEntita);

export const Sagra = z.object({
    id: z.number(),
    nome_sagra: testo,
    data_inizio: dataSchema,
    data_fine: dataSchema,
    citta: testo.nullable(),
    provincia: testo.nullable(),
    lat: z.number(),
    leng: z.number(),
    locandina: z.url().nullable(),
    link_pagina_ufficiale: z.url().nullable(),
    category: testo,
    descrizione: testo.nullable(),
    ora_inizio: z.string().nullable(),
    distanza_km: z.number().nullable().nullish()
})

export type Sagra = z.infer<typeof Sagra>;
