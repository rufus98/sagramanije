const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const REQUEST_TIMEOUT_MS = 12_000;

function getApiUrl(path: string) {
  if (!API_BASE_URL) {
    throw new Error('URL API non configurato');
  }

  return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

// React Native non applica un timeout predefinito a fetch. Senza abort, una
// connessione che non completa mai lascia React Query nello stato pending e la
// UI sullo spinner. Colleghiamo anche il signal di React Query per cancellare
// richieste ormai obsolete (per esempio quando arriva la posizione).
export async function apiFetch(
  path: string,
  { signal, ...init }: RequestInit = {},
): Promise<Response> {
  const controller = new AbortController();
  let timedOut = false;

  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  const abortRequest = () => controller.abort();

  if (signal?.aborted) {
    controller.abort();
  } else {
    signal?.addEventListener('abort', abortRequest, { once: true });
  }

  try {
    return await fetch(getApiUrl(path), { ...init, signal: controller.signal });
  } catch (error) {
    if (timedOut) {
      throw new Error('Il server non ha risposto entro 12 secondi');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abortRequest);
  }
}
