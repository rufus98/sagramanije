import { GiornoAttivita } from "@/types/attivita";

// TODO: TEMPORANEO — dataset mock finché l'endpoint del programma non è pronto.
// Le attività sono già ordinate per orario dentro ogni giorno.
export const PROGRAMMA_MOCK: GiornoAttivita[] = [
    {
        giorno: new Date("2026-07-24"),
        attivita: [
            {
                id: 1,
                giorno: new Date("2026-07-24"),
                ora_inizio: "19:00",
                ora_fine: "23:30",
                titolo: "Apertura stand gastronomici",
                descrizione: "Porchetta, primi tipici e specialità locali.",
            },
            {
                id: 2,
                giorno: new Date("2026-07-24"),
                ora_inizio: "21:00",
                ora_fine: null,
                titolo: "Concerto di apertura",
                descrizione: "Musica dal vivo con la band locale in piazza.",
            },
            {
                id: 3,
                giorno: new Date("2026-07-24"),
                ora_inizio: "23:30",
                ora_fine: null,
                titolo: "Spettacolo pirotecnico",
                descrizione: null,
            },
        ],
    },
    {
        giorno: new Date("2026-07-25"),
        attivita: [
            {
                id: 4,
                giorno: new Date("2026-07-25"),
                ora_inizio: "10:00",
                ora_fine: "12:00",
                titolo: "Mercatino dell'artigianato",
                descrizione: "Banchi di prodotti tipici e artigianato lungo il corso.",
            },
            {
                id: 5,
                giorno: new Date("2026-07-25"),
                ora_inizio: "12:30",
                ora_fine: "15:00",
                titolo: "Pranzo con la porchetta",
                descrizione: "Menù degustazione a cura dei ristoratori del paese.",
            },
            {
                id: 6,
                giorno: new Date("2026-07-25"),
                ora_inizio: "17:00",
                ora_fine: null,
                titolo: "Gara di taglio della porchetta",
                descrizione: "Sfida tra norcini con premiazione finale.",
            },
            {
                id: 7,
                giorno: new Date("2026-07-25"),
                ora_inizio: "21:30",
                ora_fine: null,
                titolo: "Serata di ballo liscio",
                descrizione: null,
            },
        ],
    },
    {
        giorno: new Date("2026-07-26"),
        attivita: [
            {
                id: 8,
                giorno: new Date("2026-07-26"),
                ora_inizio: "09:30",
                ora_fine: null,
                titolo: "Camminata tra gli ulivi",
                descrizione: "Passeggiata guidata con colazione contadina inclusa.",
            },
            {
                id: 9,
                giorno: new Date("2026-07-26"),
                ora_inizio: "16:00",
                ora_fine: "18:00",
                titolo: "Laboratori per bambini",
                descrizione: "Giochi e attività a tema per i più piccoli.",
            },
            {
                id: 10,
                giorno: new Date("2026-07-26"),
                ora_inizio: "22:00",
                ora_fine: null,
                titolo: "Concerto finale e saluti",
                descrizione: "Gran finale della sagra con la banda del paese.",
            },
        ],
    },
];
