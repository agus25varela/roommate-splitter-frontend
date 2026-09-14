import api from '@/api/axiosConfig'
import type { Gasto, CreateGastoDTO, UpdateGastoDTO, BalanceDTO } from '@/types'

/**
 * Capa de acceso a datos de gastos contra el backend de Roommate Splitter.
 *
 * Contrato real del backend (`GastoController`):
 * - `GET    /api/gasto?usuarioId=`        → `Gasto[]`
 * - `POST   /api/gasto`                    → `Gasto` (created)
 * - `GET    /api/gasto/{id}`               → `Gasto`
 * - `PUT    /api/gasto/{id}`               → `Gasto`
 * - `DELETE /api/gasto/{id}`               → `204`
 * - `GET    /api/gasto/balances?usuarioId=` → `BalanceDTO[]`
 */
export const gastosService = {
    /**
     * Lista los gastos de un usuario.
     *
     * @param usuarioId identificador del usuario autenticado.
     * @returns promesa con los gastos del usuario.
     */
    async obtenerGastos(usuarioId: number): Promise<Gasto[]> {
        const { data } = await api.get<Gasto[]>('/gasto', {
            params: { usuarioId },
        })
        return data
    },

    /**
     * Crea un gasto nuevo.
     *
     * @param gasto DTO con los datos del gasto (incluye usuarioId).
     * @returns promesa con el gasto creado.
     */
    async crearGasto(gasto: CreateGastoDTO): Promise<Gasto> {
        const { data } = await api.post<Gasto>('/gasto', gasto)
        return data
    },

    /**
     * Obtiene los balances (quién debe cuánto a quién) de un usuario.
     *
     * @param usuarioId identificador del usuario autenticado.
     * @returns promesa con el arreglo de balances.
     */
    async obtenerBalances(usuarioId: number): Promise<BalanceDTO[]> {
        const { data } = await api.get<BalanceDTO[]>('/gasto/balances', {
            params: { usuarioId },
        })
        return data
    },

    /**
     * Actualiza un gasto existente.
     *
     * @param id identificador del gasto.
     * @param actualizacion campos a actualizar.
     * @returns promesa con el gasto actualizado.
     */
    async actualizarGasto(id: number, actualizacion: UpdateGastoDTO): Promise<Gasto> {
        const { data } = await api.put<Gasto>(`/gasto/${id}`, actualizacion)
        return data
    },

    /**
     * Elimina un gasto.
     *
     * @param id identificador del gasto.
     */
    async eliminarGasto(id: number): Promise<void> {
        await api.delete(`/gasto/${id}`)
    },
}