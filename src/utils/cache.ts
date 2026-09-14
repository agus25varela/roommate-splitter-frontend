/**
 * Utilidades de caché en localStorage con expiración (TTL).
 *
 * Usadas para no sobrecargar APIs (p. ej. GitHub REST) en renders
 * consecutivos: 'caching inteligente' de la spec.
 */

interface CacheEntry<T extends object> {
    value: T
    expiresAt: number
}

const CACHE_PREFIX = 'rs-cache'

function cacheKey(key: string): string {
    return `${CACHE_PREFIX}:${key}`
}

/**
 * Lee una entrada de caché si existe y no expiró.
 *
 * @param key clave de la entrada.
 * @returns el valor cacheado, o `null` si no existe o expiró.
 * @template T tipo del valor (objeto/serializable a JSON).
 */
export function getCached<T extends object>(key: string): T | null {
    const raw = localStorage.getItem(cacheKey(key))
    if (!raw) {
        return null
    }
    try {
        const entry = JSON.parse(raw) as CacheEntry<T>
        if (Date.now() > entry.expiresAt) {
            localStorage.removeItem(cacheKey(key))
            return null
        }
        return entry.value
    } catch {
        localStorage.removeItem(cacheKey(key))
        return null
    }
}

/**
 * Guarda un valor en caché con un tiempo de vida.
 *
 * @param key clave de la entrada.
 * @param value valor a guardar.
 * @param ttlMs tiempo de vida en milisegundos.
 */
export function setCached<T extends object>(key: string, value: T, ttlMs: number): void {
    const entry: CacheEntry<T> = { value, expiresAt: Date.now() + ttlMs }
    try {
        localStorage.setItem(cacheKey(key), JSON.stringify(entry))
    } catch {
        // Sin espacio o storage deshabilitado: se ignora silenciosamente.
    }
}

/**
 * Elimina una entrada de caché.
 *
 * @param key clave de la entrada.
 */
export function removeCached(key: string): void {
    localStorage.removeItem(cacheKey(key))
}