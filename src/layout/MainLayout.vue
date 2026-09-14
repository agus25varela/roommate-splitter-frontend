<script setup lang="ts">
/**
 * Layout principal de la app autenticada.
 *
 * - Navbar: hamburguesa (mobile), logo + nombre, selector de vistas
 *   (Gastos / Resumen / Tareas / Métricas / Logs), toggle de dark mode,
 *   perfil de usuario y logout.
 * - Sidebar: módulos del proyecto (backend, frontend, infra),
 *   acceso a documentación y estado de conexión a BD.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SvgIcon from '@/components/ui/SvgIcon.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'
import { useBackendHealth } from '@/composables/useBackendHealth'
import { env } from '@/config/env'

interface NavItem {
    key: string
    to: string
    label: string
    icon: string
}

interface ModuleItem {
    key: string
    label: string
    icon: string
}

const navItems: NavItem[] = [
    { key: 'gastos', to: '/dashboard', label: 'Gastos', icon: 'wallet' },
    { key: 'resumen', to: '/dashboard/resumen', label: 'Resumen', icon: 'grid' },
    { key: 'tareas', to: '/dashboard/tareas', label: 'Tareas', icon: 'tasks' },
    { key: 'metricas', to: '/dashboard/metricas', label: 'Métricas', icon: 'trend' },
    { key: 'logs', to: '/dashboard/logs', label: 'Logs', icon: 'terminal' },
]

const modules: ModuleItem[] = [
    { key: 'backend', label: 'Backend', icon: 'code' },
    { key: 'frontend', label: 'Frontend', icon: 'layers' },
    { key: 'infra', label: 'Infra', icon: 'box' },
]

const route = useRoute()
const router = useRouter()
const { usuario, logout } = useAuth()
const { resolved, toggleTheme } = useTheme()
const dbHealth = useBackendHealth()

const sidebarOpen = ref(false)
const userMenuOpen = ref(false)

const displayName = computed<string>(() => usuario.value?.nombre ?? 'Usuario')
const displayInitials = computed<string>(() =>
    displayName.value
        .split(/\s+/)
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase(),
)
const activeModuleKey = computed<string>(() => String(route.query.modulo ?? ''))
const docsUrl = computed<string | null>(() =>
    env.hasGithubRepo ? `https://github.com/${env.githubOwner}/${env.githubRepo}` : null,
)
const isDark = computed<boolean>(() => resolved.value === 'dark')

const dbStatusDot = computed<string>(() => {
    switch (dbHealth.status.value) {
        case 'up':
            return 'bg-emerald-500'
        case 'error':
            return 'bg-amber-500'
        case 'down':
            return 'bg-red-500'
        default:
            return 'bg-slate-400'
    }
})

function closeMenus(): void {
    sidebarOpen.value = false
    userMenuOpen.value = false
}

function handleLogout(): void {
    closeMenus()
    logout()
    router.push('/login')
}

function onOutsideClick(event: Event): void {
    const target = event.target as HTMLElement
    if (userMenuOpen.value && !target.closest('[data-user-menu]')) {
        userMenuOpen.value = false
    }
}

function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        sidebarOpen.value = false
        userMenuOpen.value = false
    }
}

watch(
    () => route.fullPath,
    () => closeMenus(),
)

watch(sidebarOpen, (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
    document.addEventListener('click', onOutsideClick)
    dbHealth.check()
})

onBeforeUnmount(() => {
    document.removeEventListener('click', onOutsideClick)
    document.body.style.overflow = ''
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-800 dark:bg-navy-950 dark:text-slate-200" @keydown="onKeydown">
    <Transition name="fade">
      <div
          v-if="sidebarOpen"
          class="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          aria-hidden="true"
          @click="sidebarOpen = false"
      />
    </Transition>

    <aside
        class="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:translate-x-0 dark:border-navy-800 dark:bg-navy-900"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
        aria-label="Navegación lateral"
    >
      <div class="flex h-16 items-center gap-3 border-b border-slate-200 px-4 dark:border-navy-800">
        <SvgIcon name="logo" :size="26" class="text-navy-700 dark:text-navy-200" aria-hidden="true" />
        <div class="leading-tight">
          <p class="text-sm font-bold text-slate-900 dark:text-white">Roommate Splitter</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">Panorama del proyecto</p>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-4">
        <p class="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Módulos del proyecto
        </p>
        <ul class="space-y-1">
          <li v-for="mod in modules" :key="mod.key">
            <RouterLink
                :to="{ path: '/dashboard/metricas', query: { modulo: mod.key } }"
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-navy-800"
                :class="
                  activeModuleKey === mod.key
                    ? 'bg-navy-50 text-navy-800 dark:bg-navy-800 dark:text-navy-100'
                    : 'text-slate-600 dark:text-slate-300'
                "
            >
              <SvgIcon :name="mod.icon" :size="18" aria-hidden="true" />
              {{ mod.label }}
            </RouterLink>
          </li>
        </ul>

        <p class="mt-6 px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Recursos
        </p>
        <ul class="space-y-1">
          <li>
            <a
                :href="docsUrl ?? '#'"
                :class="docsUrl ? '' : 'pointer-events-none opacity-50'"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800"
            >
              <SvgIcon name="docs" :size="18" aria-hidden="true" />
              Documentación
            </a>
          </li>
        </ul>
      </nav>

      <div class="border-t border-slate-200 px-4 py-3 dark:border-navy-800">
        <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300" role="status">
          <span class="relative flex h-2.5 w-2.5 shrink-0">
            <span
                v-if="dbHealth.status.value === 'up'"
                class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                :class="dbStatusDot"
            />
            <span class="relative inline-flex h-2.5 w-2.5 rounded-full" :class="dbStatusDot" />
          </span>
          <span class="truncate">{{ dbHealth.label[dbHealth.status.value] }}</span>
          <AppSpinner
              v-if="dbHealth.checking.value"
              :size="12"
              class="ml-auto text-slate-400"
              aria-hidden="true"
              label=""
          />
          <button
              v-else
              type="button"
              class="ml-auto rounded p-1 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
              :aria-label="`Volver a verificar: ${dbHealth.label[dbHealth.status.value]}`"
              @click="dbHealth.check()"
          >
            <SvgIcon name="activity" :size="14" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>

    <div class="flex min-h-screen flex-col lg:pl-64">
      <header
          class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-navy-800 dark:bg-navy-900/95"
      >
        <div class="flex h-16 items-center gap-3 px-4 sm:px-6">
          <button
              type="button"
              class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-navy-800"
              aria-label="Abrir menú"
              :aria-expanded="sidebarOpen"
              @click="sidebarOpen = !sidebarOpen"
          >
            <SvgIcon name="menu" :size="20" aria-hidden="true" />
          </button>

          <RouterLink
              to="/dashboard"
              class="flex items-center gap-2 font-bold text-slate-900 lg:hidden dark:text-white"
          >
            <SvgIcon name="logo" :size="22" class="text-navy-700 dark:text-navy-200" aria-hidden="true" />
            <span class="text-sm">Splitter</span>
          </RouterLink>

          <nav aria-label="Selector de vistas" class="ml-2 hidden flex-1 items-center gap-1 md:flex">
            <RouterLink
                v-for="item in navItems"
                :key="item.key"
                :to="item.to"
                class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:outline-none"
                :class="
                  route.path === item.to
                    ? 'bg-navy-700 text-white dark:bg-navy-700'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800'
                "
                :aria-current="route.path === item.to ? 'page' : undefined"
            >
              <SvgIcon :name="item.icon" :size="16" aria-hidden="true" />
              {{ item.label }}
            </RouterLink>
          </nav>

          <div class="ml-auto flex items-center gap-2">
            <button
                type="button"
                class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800"
                :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
                @click="toggleTheme()"
            >
              <SvgIcon :name="isDark ? 'sun' : 'moon'" :size="18" aria-hidden="true" />
            </button>

            <div class="relative" data-user-menu>
              <button
                  type="button"
                  class="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-100 dark:hover:bg-navy-800"
                  :aria-expanded="userMenuOpen"
                  aria-haspopup="menu"
                  @click="userMenuOpen = !userMenuOpen"
              >
                <span
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-xs font-bold text-white dark:bg-navy-500"
                    aria-hidden="true"
                >
                  {{ displayInitials }}
                </span>
                <span class="hidden text-sm font-medium sm:inline">{{ displayName }}</span>
                <SvgIcon name="chevron-down" :size="14" class="text-slate-400" aria-hidden="true" />
              </button>

              <div
                  v-if="userMenuOpen"
                  role="menu"
                  class="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-navy-700 dark:bg-navy-900"
              >
                <RouterLink
                    to="/settings"
                    role="menuitem"
                    class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-navy-800"
                >
                  <SvgIcon name="settings" :size="16" aria-hidden="true" />
                  Configuración
                </RouterLink>
                <button
                    type="button"
                    role="menuitem"
                    class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    @click="handleLogout"
                >
                  <SvgIcon name="logout" :size="16" aria-hidden="true" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        <nav
            aria-label="Selector de vistas"
            class="flex gap-1 overflow-x-auto px-3 pb-2 md:hidden"
        >
          <RouterLink
              v-for="item in navItems"
              :key="item.key"
              :to="item.to"
              class="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition"
              :class="
                route.path === item.to
                  ? 'bg-navy-700 text-white dark:bg-navy-700'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800'
              "
              :aria-current="route.path === item.to ? 'page' : undefined"
          >
            {{ item.label }}
          </RouterLink>
        </nav>
      </header>

      <main class="flex-1 p-4 sm:p-6 lg:px-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>