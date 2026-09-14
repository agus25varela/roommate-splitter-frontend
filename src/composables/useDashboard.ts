import { computed } from 'vue'
import { useFetch } from '@/composables/useFetch'
import { obtenerDashboard } from '@/services/githubService'
import { removeCached } from '@/utils/cache'
import type { DashboardData } from '@/types/dashboard'

const CACHE_KEY = 'dashboard:github'
const TTL_MS = 5 * 60 * 1000

/**
 * Composable del dashboard de proyecto.
 *
 * Usa `useFetch` con caché en localStorage (TTL 5 min) para no saturar la
 * API de GitHub; `refrescar` fuerza una consulta a la red.
 *
 * @returns estado y acciones del dashboard.
 */
export function useDashboard() {
    const fetchState = useFetch<DashboardData>({
        fetcher: obtenerDashboard,
        initial: null,
        cacheKey: CACHE_KEY,
        ttlMs: TTL_MS,
    })

    const data = computed<DashboardData | null>(() => fetchState.data.value)
    const loading = computed<boolean>(() => fetchState.loading.value)
    const error = computed<string | null>(() => fetchState.error.value)
    const isDemo = computed<boolean>(() => data.value?.isDemo ?? false)

    /**
     * Carga el dashboard respetando la caché.
     */
    const cargar = async (): Promise<void> => {
        await fetchState.fetch()
    }

    /**
     * Refresca los datos ignorando la caché (fuerza red).
     */
    const refrescar = async (): Promise<void> => {
        removeCached(CACHE_KEY)
        await fetchState.fetch()
    }

    return { data, loading, error, isDemo, cargar, refrescar }
}