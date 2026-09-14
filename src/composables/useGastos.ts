import { computed } from 'vue'
import type { Ref } from 'vue'
import { gastosService } from '@/services/gastosService'
import { useFetch } from '@/composables/useFetch'
import type { Gasto, CreateGastoDTO, UpdateGastoDTO, BalanceDTO } from '@/types'

/**
 * Composable de gastos para un usuario autenticado.
 *
 * Consolida la carga de gastos y balances con `useFetch` y gestiona las
 * operaciones de escritura (crear, actualizar, eliminar). Las operaciones de
 * escritura siempre invalidan y recargan los datos desde la red.
 *
 * @param usuarioId identificador del usuario autenticado.
 * @returns estados y acciones de gastos.
 */
export function useGastos(usuarioId: number) {
    const gastosFetch = useFetch<Gasto[]>({
        fetcher: (): Promise<Gasto[]> => gastosService.obtenerGastos(usuarioId),
        initial: [],
    })
    const deudasFetch = useFetch<BalanceDTO[]>({
        fetcher: (): Promise<BalanceDTO[]> => gastosService.obtenerBalances(usuarioId),
        initial: [],
    })

    const gastos: Ref<Gasto[]> = gastosFetch.data as Ref<Gasto[]>
    const deudas: Ref<BalanceDTO[]> = deudasFetch.data as Ref<BalanceDTO[]>

    const loading = computed<boolean>(
        (): boolean => gastosFetch.loading.value || deudasFetch.loading.value,
    )
    const error = computed<string | null>(() => gastosFetch.error.value ?? deudasFetch.error.value)

    /**
     * Recarga gastos y balances desde el backend.
     */
    const cargarGastos = async (): Promise<void> => {
        await Promise.all([gastosFetch.fetch(), deudasFetch.fetch()])
    }

    /**
     * Crea un gasto y recarga la vista.
     *
     * @param nuevoGasto DTO con los datos del gasto.
     */
    const crearGasto = async (nuevoGasto: CreateGastoDTO): Promise<void> => {
        await gastosService.crearGasto(nuevoGasto)
        await cargarGastos()
    }

    /**
     * Actualiza un gasto y recarga la vista.
     *
     * @param id identificador del gasto.
     * @param gastoActualizado campos a actualizar.
     */
    const actualizarGasto = async (id: number, gastoActualizado: UpdateGastoDTO): Promise<void> => {
        await gastosService.actualizarGasto(id, gastoActualizado)
        await cargarGastos()
    }

    /**
     * Elimina un gasto y recarga la vista.
     *
     * @param id identificador del gasto.
     */
    const eliminarGasto = async (id: number): Promise<void> => {
        await gastosService.eliminarGasto(id)
        await cargarGastos()
    }

    const totalGastos = computed<number>(() =>
        gastos.value.reduce((sum: number, g: Gasto): number => sum + g.monto, 0),
    )

    return {
        gastos,
        deudas,
        loading,
        error,
        cargarGastos,
        crearGasto,
        actualizarGasto,
        eliminarGasto,
        totalGastos,
    }
}

export type UseGastosReturn = ReturnType<typeof useGastos>