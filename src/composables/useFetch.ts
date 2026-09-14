import { ref } from 'vue'
import type { Ref } from 'vue'
import { getCached, setCached } from '@/utils/cache'

export interface UseFetchOptions<T extends object> {
    /** Función que realiza la petición y devuelve los datos. */
    fetcher: () => Promise<T>
    /** Valor inicial de `data` (por defecto `null`). */
    initial?: T | null
    /** Si se define, habilita caché en localStorage. */
    cacheKey?: string
    /** Tiempo de vida de la caché en ms (obligatorio junto a `cacheKey`). */
    ttlMs?: number
}

export interface UseFetchResult<T extends object> {
    data: Ref<T | null>
    error: Ref<string | null>
    loading: Ref<boolean>
    /** `false` cuando `data` provino de caché, `true` cuando de red. */
    isFresh: Ref<boolean>
    /**
     * Ejecuta (o re-ejecuta) la petición. Si hay caché válida la usa
     * directamente y no llama a la red.
     */
    fetch: () => Promise<void>
}

/**
 * Composable genérico para peticiones con estado tipado.
 *
 * Centraliza el manejo de `loading`/`error`/`data`, con caché opcional en
 * localStorage para evitar llamadas redundantes a la red.
 *
 * @param options configuración de la petición.
 * @returns estado y acción `fetch`.
 */
export function useFetch<T extends object>(options: UseFetchOptions<T>): UseFetchResult<T> {
    const data = ref<T | null>(options.initial ?? null) as Ref<T | null>
    const error = ref<string | null>(null)
    const loading = ref(false)
    const isFresh = ref(true)

    /**
     * Ejecuta la petición. Respeta la caché si fue configurada.
     */
    const fetch = async (): Promise<void> => {
        loading.value = true
        error.value = null
        try {
            if (options.cacheKey && options.ttlMs) {
                const cached = getCached<T>(options.cacheKey)
                if (cached !== null) {
                    data.value = cached
                    isFresh.value = false
                    return
                }
            }
            const result = await options.fetcher()
            data.value = result
            isFresh.value = true
            if (options.cacheKey && options.ttlMs) {
                setCached(options.cacheKey, result, options.ttlMs)
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Error inesperado'
        } finally {
            loading.value = false
        }
    }

    return { data, error, loading, isFresh, fetch }
}