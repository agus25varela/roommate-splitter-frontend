export interface Gasto {
    id: number
    descripcion: string
    monto: number
    quienPago: string
    fecha: string
    usuarioId: number
}

export interface CreateGastoDTO {
    descripcion: string
    monto: number
    quienPago: string
    fecha: string
    usuarioId: number
}

export interface UpdateGastoDTO {
    descripcion?: string
    monto?: number
    quienPago?: string
    fecha?: string
}

export type QuienPago = 'yo' | 'roommate_a' | 'roommate_b'

export const QUIEN_PAGO_OPCIONES: readonly QuienPago[] = ['yo', 'roommate_a', 'roommate_b']

export const QUIEN_PAGO_LABEL: Record<QuienPago, string> = {
    yo: 'Yo',
    roommate_a: 'Roommate A',
    roommate_b: 'Roommate B',
}