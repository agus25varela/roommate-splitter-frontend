export interface Usuario {
    id: number
    email: string
    nombre: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface SignupRequest {
    email: string
    password: string
    nombre: string
}

export interface AuthResponse {
    usuario: Usuario
    token: string
}