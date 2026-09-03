import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, Router, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

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

// Guard: protege rutas que requieren autenticación
router.beforeEach(
    (
        to: RouteLocationNormalized,
        from: RouteLocationNormalized,
        next: NavigationGuardNext
    ): void => {
        const usuarioId = localStorage.getItem('usuarioId')
        const requiereAuth = to.meta?.requiresAuth

        if (requiereAuth && !usuarioId) {
            // No autenticado, redirige a login
            next('/login')
        } else if (to.path === '/login' && usuarioId) {
            // Ya autenticado, redirige a dashboard
            next('/dashboard')
        } else {
            next()
        }
    }
)

export default router