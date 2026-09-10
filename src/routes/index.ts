// src/routes/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, Router, RouteLocationNormalized } from 'vue-router'

// Pages
import LoginPage from '@/pages/LoginPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: {
            requiresAuth: false,
        },
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardPage,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/dashboard',
    },
]

const router: Router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

// Guard: protege rutas que requieren autenticación (sintaxis nueva)
router.beforeEach(
    (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
        const usuarioId = localStorage.getItem('usuarioId')
        const requiereAuth = to.meta?.requiresAuth

        if (requiereAuth && !usuarioId) {
            // No autenticado, redirige a login
            return '/login'
        } else if (to.path === '/login' && usuarioId) {
            // Ya autenticado, redirige a dashboard
            return '/dashboard'
        }
        // Permitir navegación
        return true
    }
)

export default router