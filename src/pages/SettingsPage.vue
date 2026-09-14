<script setup lang="ts">
/**
 * Configuración de la app.
 *
 * Tema (light/dark/system), datos del entorno (backend y repo de GitHub del
 * dashboard) y cierre de sesión. La configuración del repo es de solo lectura:
 * se define por variables de entorno en build time.
 */
import { useRouter } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import AppButton from '@/components/ui/AppButton.vue'
import SvgIcon from '@/components/ui/SvgIcon.vue'
import { env } from '@/config/env'
import { useTheme } from '@/composables/useTheme'
import type { ThemeMode } from '@/composables/useTheme'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { theme, setTheme, resolved } = useTheme()
const { usuario, logout, loading } = useAuth()

const OPCS_TEMA: { value: ThemeMode; label: string }[] = [
    { value: 'light', label: 'Claro' },
    { value: 'dark', label: 'Oscuro' },
    { value: 'system', label: 'Sistema' },
]

function temaLabel(value: ThemeMode): string {
    return OPCS_TEMA.find((o) => o.value === value)?.label ?? value
}

function cerrarSesion(): void {
    logout()
    void router.push('/login')
}
</script>

<template>
  <MainLayout>
    <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Configuración</h1>
    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Preferencias de la app y estado de la configuración.
    </p>

    <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <div class="mb-4 flex items-center gap-3">
          <span
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-100 text-navy-700 dark:bg-navy-500/15 dark:text-navy-200"
          >
            <SvgIcon name="sun" :size="18" aria-hidden="true" />
          </span>
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Tema</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Modo actual: {{ temaLabel(theme) }} (resuelto: {{ resolved }})
            </p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2" role="group" aria-label="Modo de tema">
          <button
              v-for="opc in OPCS_TEMA"
              :key="opc.value"
              type="button"
              class="rounded-lg border px-4 py-2 text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:outline-none"
              :class="
                theme === opc.value
                  ? 'border-navy-700 bg-navy-700 text-white dark:border-navy-500 dark:bg-navy-600'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-navy-700 dark:bg-navy-800 dark:text-slate-300 dark:hover:bg-navy-700'
              "
              @click="setTheme(opc.value)"
          >
            {{ opc.label }}
          </button>
        </div>
      </Card>

      <Card>
        <div class="mb-4 flex items-center gap-3">
          <span
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300"
          >
            <SvgIcon name="database" :size="18" aria-hidden="true" />
          </span>
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Entorno</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">Variables de build</p>
          </div>
        </div>

        <dl class="space-y-3">
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              API de Roommate Splitter
            </dt>
            <dd class="mt-1 font-mono text-sm text-slate-800 dark:text-slate-200">{{ env.apiUrl }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Repositorio del dashboard (GitHub)
            </dt>
            <dd class="mt-1 flex flex-wrap items-center gap-2 font-mono text-sm text-slate-800 dark:text-slate-200">
              <span v-if="env.hasGithubRepo">
                {{ env.githubOwner }}/{{ env.githubRepo }}
              </span>
              <span v-else class="text-slate-400">No configurado</span>
              <Badge :variant="env.hasGithubRepo ? 'success' : 'warning'" size="sm">
                {{ env.hasGithubRepo ? 'Configurado' : 'Demo' }}
              </Badge>
            </dd>
            <dd class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Token: {{ env.githubToken ? 'presente (Bearer)' : 'no configurado · modo público' }}
            </dd>
          </div>
        </dl>
      </Card>
    </div>

    <Card class="mt-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span
              class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
          >
            <SvgIcon name="user" :size="18" aria-hidden="true" />
          </span>
          <div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white">Sesión</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              {{ usuario ? `${usuario.nombre} · ${usuario.email}` : 'Sin sesión activa' }}
            </p>
          </div>
        </div>
        <AppButton variant="danger" size="md" icon="logout" :loading="loading" @click="cerrarSesion">
          Cerrar sesión
        </AppButton>
      </div>
    </Card>
  </MainLayout>
</template>