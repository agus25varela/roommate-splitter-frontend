// src/composables/useGastos.ts
import { ref, computed } from 'vue'
import { gastosService } from '@/services/gastosService'
import type { Gasto, Deuda } from '@/types'

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

    const totalGastos = computed((): number =>
        gastos.value.reduce((sum: number, g: Gasto): number => sum + g.monto, 0)
    )

    return {
        gastos: gastos,
        deudas: deudas,
        loading,
        error,
        cargarGastos
    }
}