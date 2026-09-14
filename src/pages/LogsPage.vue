<script setup lang="ts">
/**
 * Bitácora de actividad y ejecuciones de CI.
 *
 * Lista unificada de commits, PRs y runs + tabla de ejecuciones de GitHub
 * Actions con su conclusión.
 */
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import AppAlert from '@/components/ui/AppAlert.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import AppButton from '@/components/ui/AppButton.vue'
import SvgIcon from '@/components/ui/SvgIcon.vue'
import { useDashboard } from '@/composables/useDashboard'
import { useAuth } from '@/composables/useAuth'
import { formatearFechaHora, tiempoRelativo } from '@/utils/format'
import type { ActivityEvent, GithubRun } from '@/types'

const router = useRouter()
const { usuario, cargarUsuario } = useAuth()
const { data, loading, isDemo, error, cargar, refrescar } = useDashboard()

const activityMeta: Record<ActivityEvent['type'], { icon: string; label: string; tone: string }> = {
    commit: {
        icon: 'git-commit',
        label: 'Commit',
        tone: 'bg-navy-100 text-navy-700 dark:bg-navy-500/15 dark:text-navy-200',
    },
    pull: {
        icon: 'git-branch',
        label: 'Pull request',
        tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    },
    run: {
        icon: 'zap',
        label: 'Run',
        tone: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    },
}

const conclusionVariant = (conclusion: string | null): 'success' | 'danger' | 'warning' | 'neutral' => {
    if (conclusion === 'success') return 'success'
    if (conclusion === 'failure') return 'danger'
    if (conclusion === 'cancelled' || conclusion === 'skipped') return 'warning'
    return 'neutral'
}

const pullBadgeVariant = (state: string): 'success' | 'warning' | 'danger' => {
    if (state === 'merged') return 'success'
    if (state === 'open') return 'warning'
    return 'danger'
}

const runsOrdenados = computed<GithubRun[]>(() => {
    const runs = [...(data.value?.runs ?? [])]
    runs.sort((a: GithubRun, b: GithubRun) => b.createdAt.localeCompare(a.createdAt))
    return runs
})

onMounted(async () => {
    cargarUsuario()
    if (!usuario.value) {
        await router.push('/login')
        return
    }
    await cargar()
})
</script>

<template>
  <MainLayout>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Logs</h1>
        <p v-if="data" class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{ data.repo }} · bitácora de actividad y CI
        </p>
      </div>
      <AppButton variant="secondary" size="sm" icon="activity" :loading="loading" @click="refrescar">
        Refrescar
      </AppButton>
    </div>

    <AppAlert v-if="isDemo" variant="warning" title="Modo demo" class="mt-4">
      {{ data?.warning }}
    </AppAlert>

    <AppAlert v-if="error" variant="danger" title="No se pudieron cargar los logs" class="mt-4">
      {{ error }}
    </AppAlert>

    <div v-if="loading && !data" class="mt-12 flex items-center justify-center py-16">
      <AppSpinner :size="28" label="Cargando logs" />
    </div>

    <template v-else-if="data">
      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div class="mb-4 flex items-center gap-3">
            <span
                class="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-100 text-navy-700 dark:bg-navy-500/15 dark:text-navy-200"
            >
              <SvgIcon name="terminal" :size="18" aria-hidden="true" />
            </span>
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Actividad</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Ultimos eventos unificados</p>
            </div>
          </div>

          <ul v-if="data.activity.length > 0" class="space-y-1">
            <li
                v-for="evento in data.activity"
                :key="evento.id"
                class="flex items-start gap-3 rounded-lg px-2 py-2.5"
            >
              <span
                  class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  :class="activityMeta[evento.type].tone"
              >
                <SvgIcon :name="activityMeta[evento.type].icon" :size="15" aria-hidden="true" />
              </span>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-slate-900 dark:text-white">
                  {{ evento.title }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  {{ evento.subtitle }}
                  <span class="mx-1">·</span>
                  {{ formatearFechaHora(evento.date) }}
                  <span class="mx-1">·</span>
                  {{ tiempoRelativo(evento.date) }}
                </p>
              </div>
              <Badge
                  v-if="evento.type === 'pull'"
                  :variant="pullBadgeVariant(evento.meta)"
                  size="sm"
              >
                {{ evento.meta }}
              </Badge>
            </li>
          </ul>
          <p v-else class="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Sin eventos registrados.
          </p>
        </Card>

        <Card padless>
          <div class="mb-2 flex items-center gap-3 border-b border-slate-200 p-4 dark:border-navy-800">
            <span
                class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
            >
              <SvgIcon name="zap" :size="18" aria-hidden="true" />
            </span>
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Ejecuciones (CI)</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                {{ runsOrdenados.length }} runs de GitHub Actions
              </p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 text-left dark:bg-navy-800">
                <tr>
                  <th scope="col" class="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300">Nombre</th>
                  <th scope="col" class="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300">SHA</th>
                  <th scope="col" class="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300">Conclusión</th>
                  <th scope="col" class="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300">Fecha</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-navy-800">
                <tr
                    v-for="run in runsOrdenados.slice(0, 20)"
                    :key="run.id"
                    class="transition hover:bg-slate-50 dark:hover:bg-navy-800/50"
                >
                  <td class="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">{{ run.name }}</td>
                  <td class="px-4 py-2.5 font-mono text-xs text-slate-500 dark:text-slate-400">{{ run.headSha }}</td>
                  <td class="px-4 py-2.5">
                    <Badge :variant="conclusionVariant(run.conclusion)" size="sm">
                      {{ run.status === 'completed' ? (run.conclusion ?? '—') : run.status }}
                    </Badge>
                  </td>
                  <td class="px-4 py-2.5 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                    {{ formatearFechaHora(run.createdAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-if="runsOrdenados.length === 0" class="p-4 text-sm text-slate-500 dark:text-slate-400">
            Sin ejecuciones registradas.
          </p>
        </Card>
      </div>
    </template>
  </MainLayout>
</template>