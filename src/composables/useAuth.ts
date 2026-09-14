import { ref } from 'vue'
import axios from 'axios'
import { authService } from '@/services/authService'
import type { Usuario } from '@/types'

const USUARIO_KEY = 'usuario'
const USUARIO_ID_KEY = 'usuarioId'

/**
 * Extrae el mensaje legible de un error de Axios.
 *
 * @param error error capturado; si no es de Axios devuelve el fallback.
 * @param fallback mensaje por defecto.
 * @returns mensaje de error para mostrar al usuario.
 */
function extraerMensajeError(error: unknown, fallback: string): string {
    if (axios.isAxiosError<{ mensaje?: string }>(error)) {
        return error.response?.data?.mensaje ?? fallback
    }
    return fallback
}

/**
 * Composable de autenticación.
 *
 * Gestiona el estado del usuario autenticado y su persistencia en
 * localStorage. El backend no emite JWT: las rutas son públicas y la sesión
 * se guarda en `localStorage`.
 *
 * @returns estado y acciones de autenticación.
 */
export function useAuth() {
    const usuario = ref<Usuario | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    /**
     * Restaura el usuario persistido en localStorage (si existe).
     */
    const cargarUsuario = (): void => {
        const guardado = localStorage.getItem(USUARIO_KEY)
        if (!guardado) {
            usuario.value = null
            return
        }
        try {
            usuario.value = JSON.parse(guardado) as Usuario
        } catch {
            localStorage.removeItem(USUARIO_KEY)
            usuario.value = null
        }
    }

    /**
     * Inicia sesión con email y contraseña y persiste la sesión.
     *
     * @param email correo del usuario.
     * @param password contraseña del usuario.
     */
    const login = async (email: string, password: string): Promise<void> => {
        loading.value = true
        error.value = null
        try {
            const data = await authService.login({ email, password })
            usuario.value = data
            localStorage.setItem(USUARIO_KEY, JSON.stringify(data))
            localStorage.setItem(USUARIO_ID_KEY, String(data.id))
        } catch (err) {
            usuario.value = null
            localStorage.removeItem(USUARIO_KEY)
            localStorage.removeItem(USUARIO_ID_KEY)
            error.value = extraerMensajeError(err, 'Email o contraseña incorrectos')
            throw error.value
        } finally {
            loading.value = false
        }
    }

    /**
     * Registra un usuario nuevo.
     *
     * @param email correo del usuario.
     * @param nombre nombre del usuario.
     * @param password contraseña (mínimo 6 caracteres).
     */
    const signup = async (email: string, nombre: string, password: string): Promise<void> => {
        loading.value = true
        error.value = null
        try {
            await authService.signup({ email, nombre, password })
            await login(email, password)
        } catch (err) {
            error.value = extraerMensajeError(err, 'Error al registrarse')
            throw error.value
        } finally {
            loading.value = false
        }
    }

    /**
     * Cierra la sesión limpiando el estado y el localStorage.
     */
    const logout = (): void => {
        usuario.value = null
        localStorage.removeItem(USUARIO_KEY)
        localStorage.removeItem(USUARIO_ID_KEY)
        error.value = null
    }

    /**
     * Indica si hay una sesión activa.
     *
     * @returns `true` si existe usuario o id persistido.
     */
    const isAutenticado = (): boolean => {
        return usuario.value !== null || localStorage.getItem(USUARIO_ID_KEY) !== null
    }

    return {
        usuario,
        loading,
        error,
        login,
        signup,
        logout,
        isAutenticado,
        cargarUsuario,
    }
}