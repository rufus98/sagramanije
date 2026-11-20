import type { Sagra } from "@/types/sagra";
import { ThemedText } from "./themed-text";

const dateFormat = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "short" });
const longDateFormat = new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long" });

export function formatDateRange(
    { data_inizio: start, data_fine: end }: Pick<Sagra, "data_inizio" | "data_fine">,
    month: "short" | "long" = "short",
) {
    const formatter = month === "long" ? longDateFormat : dateFormat;
    if (!start) return end ? `Fino al ${formatter.format(end)}` : null;
    const firstDay = formatter.format(start);
    if (!end || end.getTime() === start.getTime()) return firstDay;
    const lastDay = formatter.format(end);
    if (month === "long" && start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
        return `${start.getDate()}–${lastDay}`;
    }
    return `${firstDay} – ${lastDay}`;
}

export default function DateFormatter({ sagra }: { sagra: Sagra }) {
    return <ThemedText type="smallBold">{formatDateRange(sagra) ?? "Data non disponibile"}</ThemedText>;
}
