// src/services/gastosService.ts
import api from '@/api/axiosConfig'
import type { Gasto, CreateGastoDTO, DeudaResponse } from '@/types'

export const gastosService = {
    async obtenerGastos(usuarioId: string): Promise<Gasto[]> {
        const { data } = await api.get<Gasto[]>('/gasto', {
            params: { usuarioId },
        })
        return data
    },

    async crearGasto(gasto: CreateGastoDTO, usuarioId: string): Promise<Gasto> {
        const { data } = await api.post<Gasto>('/gasto', {
            ...gasto,
            usuarioId
        })
        return data
    },

    async obtenerDeudas(usuarioId: string): Promise<DeudaResponse> {
        const { data } = await api.get<DeudaResponse>('/gasto/balances', {
            params: { usuarioId },
        })
        return data
    },

    async actualizarGasto(id: string, actualizacion: Partial<Gasto>): Promise<Gasto> {
        const { data } = await api.put<Gasto>(`/gasto/${id}`, actualizacion)
        return data
    },

    async eliminarGasto(id: string): Promise<void> {
        await api.delete(`/gasto/${id}`)
    },
}