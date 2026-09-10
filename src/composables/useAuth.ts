import { ref } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const useAuth = () => {
    const usuario = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Cargar usuario desde localStorage al iniciar
    const cargarUsuario = () => {
        const usuarioGuardado = localStorage.getItem('usuario')
        if (usuarioGuardado) {
            usuario.value = JSON.parse(usuarioGuardado)
        }
    }

    // Login: validar credenciales en el backend
    const login = async (email: string, password: string) => {
        loading.value = true
        error.value = null

        try {
            const response = await axios.post(`${API_URL}/usuario/login`, {
                email,
                password
            })

            // Si la respuesta es 200, guardar usuario en estado y localStorage
            usuario.value = response.data
            localStorage.setItem('usuario', JSON.stringify(response.data))
            localStorage.setItem('usuarioId', response.data.id.toString())

            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.mensaje || 'Email o contraseña incorrectos'
            usuario.value = null
            localStorage.removeItem('usuario')
            localStorage.removeItem('usuarioId')
            throw error.value
        } finally {
            loading.value = false
        }
    }

    // Signup: registrar nuevo usuario
    const signup = async (email: string, nombre: string, password: string) => {
        loading.value = true
        error.value = null

        try {
            const response = await axios.post(`${API_URL}/usuario/signup`, {
                email,
                nombre,
                password
            })

            // Después de signup exitoso, hacer login automático
            return await login(email, password)
        } catch (err: any) {
            error.value = err.response?.data?.mensaje || 'Error al registrarse'
            throw error.value
        } finally {
            loading.value = false
        }
    }

    // Logout: limpiar sesión
    const logout = () => {
        usuario.value = null
        localStorage.removeItem('usuario')
        localStorage.removeItem('usuarioId')
        error.value = null
    }

    // Verificar si está autenticado
    const isAutenticado = () => {
        return !!usuario.value || !!localStorage.getItem('usuarioId')
    }

    return {
        usuario,
        loading,
        error,
        login,
        signup,
        logout,
        isAutenticado,
        cargarUsuario
    }
}