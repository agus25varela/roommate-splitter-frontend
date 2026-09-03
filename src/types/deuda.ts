export interface Deuda {
    entre: [string, string]
    monto: number
}

export interface DeudaResponse {
    deudas: Deuda[]
}