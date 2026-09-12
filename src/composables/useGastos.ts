// src/composables/useGastos.ts
import { ref, computed } from 'vue'
import { gastosService } from '@/services/gastosService'
import type { Gasto, Deuda, CreateGastoDTO } from '@/types'

export const useGastos = (usuarioId: string) => {
    const gastos = ref<Gasto[]>([])
    const deudas = ref<Deuda[]>([])
    const loading = ref<boolean>(false)
    const error = ref<string | null>(null)

    const cargarGastos = async (): Promise<void> => {
        loading.value = true
        try {
            gastos.value = await gastosService.obtenerGastos(usuarioId)
            const response = await gastosService.obtenerDeudas(usuarioId)
            deudas.value = response.deudas
            error.value = null
        } catch (e) {
            error.value = 'Error al cargar gastos'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const crearGasto = async (nuevoGasto: CreateGastoDTO): Promise<void> => {
        loading.value = true
        try {
            await gastosService.crearGasto(nuevoGasto, usuarioId)
            await cargarGastos()
            error.value = null
        } catch (e) {
            error.value = 'Error al crear gasto'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const actualizarGasto = async (id: string, gastoActualizado: Partial<Gasto>): Promise<void> => {
        loading.value = true
        try {
            await gastosService.actualizarGasto(id, gastoActualizado)
            await cargarGastos()
            error.value = null
        } catch (e) {
            error.value = 'Error al actualizar gasto'
            console.error(e)
        } finally {
            loading.value = false
        }
    }

    const eliminarGasto = async (id: string): Promise<void> => {
        loading.value = true
        try {
            await gastosService.eliminarGasto(id)
            await cargarGastos()
            error.value = null
        } catch (e) {
            error.value = 'Error al eliminar gasto'
            console.error(e)
        } finally {
            loading.value = false
        }
        }

    const totalGastos = computed((): number =>
        gastos.value.reduce((sum: number, g: Gasto): number => sum + g.monto, 0)
    )

    return {
        gastos,
        deudas,
        loading,
        error,
        cargarGastos,
        crearGasto,
        actualizarGasto,
        eliminarGasto
    }
}