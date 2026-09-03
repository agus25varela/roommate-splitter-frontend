import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
})

// Interceptor para agregar usuarioId a requests (si lo necesitas)
api.interceptors.request.use(config => {
    const usuarioId = localStorage.getItem('usuarioId')
    if (usuarioId && !config.params) {
        config.params = { usuarioId }
    }
    return config
})

export default api