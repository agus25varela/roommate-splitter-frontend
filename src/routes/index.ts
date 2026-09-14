import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, Router, RouteLocationNormalized } from 'vue-router'

/**
 * Páginas cargadas de forma diferida para optimizar el bundle inicial.
 */
const LoginPage = () => import('@/pages/LoginPage.vue')
const DashboardPage = () => import('@/pages/DashboardPage.vue')
const ResumenPage = () => import('@/pages/ResumenPage.vue')
const TareasPage = () => import('@/pages/TareasPage.vue')
const MetricasPage = () => import('@/pages/MetricasPage.vue')
const LogsPage = () => import('@/pages/LogsPage.vue')
const SettingsPage = () => import('@/pages/SettingsPage.vue')

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: { requiresAuth: false },
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardPage,
        meta: { requiresAuth: true },
    },
    {
        path: '/dashboard/resumen',
        name: 'resumen',
        component: ResumenPage,
        meta: { requiresAuth: true },
    },
    {
        path: '/dashboard/tareas',
        name: 'tareas',
        component: TareasPage,
        meta: { requiresAuth: true },
    },
    {
        path: '/dashboard/metricas',
        name: 'metricas',
        component: MetricasPage,
        meta: { requiresAuth: true },
    },
    {
        path: '/dashboard/logs',
        name: 'logs',
        component: LogsPage,
        meta: { requiresAuth: true },
    },
    {
        path: '/settings',
        name: 'settings',
        component: SettingsPage,
        meta: { requiresAuth: true },
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

/**
 * Guard global: redirige a login si la ruta requiere auth y no hay sesión,
 * y viceversa (ya autenticado no entra a /login).
 */
router.beforeEach((to: RouteLocationNormalized) => {
    const usuarioId = localStorage.getItem('usuarioId')
    const requiereAuth = to.meta?.requiresAuth

    if (requiereAuth && !usuarioId) {
        return '/login'
    }
    if (to.path === '/login' && usuarioId) {
        return '/dashboard'
    }
    return true
})

export default router