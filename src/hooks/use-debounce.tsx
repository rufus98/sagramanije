import { useEffect, useState } from "react";

// Ritorna il valore aggiornato solo dopo `delay` ms senza cambiamenti.
export default function useDebounce<T>(value: T, delay = 300): T {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        // se `value` cambia prima dello scadere del timer lo resetto
        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
}
