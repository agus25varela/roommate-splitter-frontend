export interface Gasto {
    id: string
    usuarioId: string
    monto: number
    descripcion: string
    categoría: string
    fecha: string
}

export interface CreateGastoDTO {
    usuarioId: string
    monto: number
    descripcion: string
    categoría: string
    fecha: string
}

export interface UpdateGastoDTO {
    monto?: number
    descripcion?: string
    categoría?: string
    fecha?: string
}