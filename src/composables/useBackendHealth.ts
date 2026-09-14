import { ref } from 'vue'
import axios from 'axios'
import { env } from '@/config/env'

/** Estado de conexión con el backend / base de datos. */
export type BackendStatus = 'up' | 'error' | 'down' | 'unknown'

const STATUS_LABEL: Record<BackendStatus, string> = {
    up: 'BD conectada',
    error: 'Backend con error',
    down: 'Backend sin respuesta',
    unknown: 'Verificando…',
}

/**
 * Composable de salud del backend.
 *
 * Sondea el endpoint de balances (que consulta la BD) para distinguir:
 * - `up`:  respuesta HTTP 2xx        → backend y BD operativos.
 * - `error`: respuesta HTTP >= 400   → backend activo pero con error (p. ej. BD caída).
 * - `down`: error de red             → backend inalcanzable.
 * - `unknown`: aún no verificado.
 *
 * @returns estado, indicador de verificación y acción `check`.
 */
export function useBackendHealth() {
    const status = ref<BackendStatus>('unknown')
    const checking = ref(false)

    /**
     * Ejecuta el sondeo del backend.
     */
    const check = async (): Promise<void> => {
        checking.value = true
        try {
            const response = await axios.get<unknown>(`${env.apiUrl}/gasto/balances`, {
                params: { usuarioId: 0 },
                timeout: 5000,
            })
            status.value = response.status < 400 ? 'up' : 'error'
        } catch (err) {
            if (axios.isAxiosError(err)) {
                status.value = err.response ? 'error' : 'down'
            } else {
                status.value = 'error'
            }
        } finally {
            checking.value = false
        }
    }

    return { status, checking, check, label: STATUS_LABEL }
}