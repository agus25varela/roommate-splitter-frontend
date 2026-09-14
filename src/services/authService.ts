import api from '@/api/axiosConfig'
import type { Usuario, LoginRequest, SignupRequest } from '@/types'

const AUTH_ROUTES = {
    login: '/usuario/login',
    signup: '/usuario/signup',
} as const

export interface ApiError {
    mensaje: string
}

/**
 * Capa de acceso a datos de autenticación contra el backend.
 *
 * Contrato real del backend (`UsuarioController`):
 * - `POST /api/usuario/signup` → `Usuario` (created)
 * - `POST /api/usuario/login`  → `Usuario`
 * - `GET  /api/usuario/{id}`   → `Usuario`
 */
export const authService = {
    /**
     * Inicia sesión con email y contraseña.
     *
     * @param email correo del usuario.
     * @param password contraseña del usuario.
     * @returns promesa con el usuario autenticado.
     */
    async login({ email, password }: LoginRequest): Promise<Usuario> {
        const { data } = await api.post<Usuario>(AUTH_ROUTES.login, { email, password })
        return data
    },

    /**
     * Registra un usuario nuevo. El backend no emite token: devuelve el usuario.
     *
     * @param payload datos de registro (email, nombre, password).
     * @returns promesa con el usuario creado.
     */
    async signup(payload: SignupRequest): Promise<Usuario> {
        const { data } = await api.post<Usuario>(AUTH_ROUTES.signup, payload)
        return data
    },

    /**
     * Obtiene un usuario por su identificador.
     *
     * @param id identificador del usuario.
     * @returns promesa con el usuario.
     */
    async obtenerUsuario(id: number): Promise<Usuario> {
        const { data } = await api.get<Usuario>(`/usuario/${id}`)
        return data
    },
}