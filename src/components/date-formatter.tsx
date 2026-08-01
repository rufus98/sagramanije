import { Sagra } from "@/types/sagra";
import { ThemedText } from "./themed-text";

export default function DateFormatter({ sagra }: { sagra: Sagra }) {
    return <ThemedText type="smallBold">
        {sagra.data_inizio && sagra.data_fine ?
            `${sagra.data_inizio.toLocaleDateString("it-IT", { day: "numeric", month: "short" })} - ${sagra.data_fine.toLocaleDateString("it-IT", { day: "numeric", month: "short" })} `
            :
            (sagra.data_inizio ?
                `${sagra.data_inizio.toLocaleDateString("it-IT", { day: "numeric", month: "short" })}`
                :
                "Data non disponibile"
            )
        }
    </ThemedText>
}