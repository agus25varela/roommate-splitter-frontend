<script setup lang="ts">
/**
 * Resumen ejecutivo del dashboard del proyecto.
 *
 * Métricas clave del repo, timeline de actividad y estado del repo, con
 * caché en localStorage y banner de modo demo cuando aplica.
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'
import Card from '@/components/ui/Card.vue'
import MetricCard from '@/components/ui/MetricCard.vue'
import AppAlert from '@/components/ui/AppAlert.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import AppButton from '@/components/ui/AppButton.vue'
import Badge from '@/components/ui/Badge.vue'
import SvgIcon from '@/components/ui/SvgIcon.vue'
import { useDashboard } from '@/composables/useDashboard'
import { useAuth } from '@/composables/useAuth'
import { tiempoRelativo } from '@/utils/format'
import type { ActivityEvent } from '@/types'

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

const pullBadgeVariant = (state: string): 'success' | 'warning' | 'danger' => {
    if (state === 'merged') return 'success'
    if (state === 'open') return 'warning'
    return 'danger'
}

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
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Resumen ejecutivo</h1>
        <p v-if="data" class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{ data.repo }}
          <span class="mx-1">·</span>
          rama {{ data.defaultBranch }}
          <span class="mx-1">·</span>
          actualizado {{ tiempoRelativo(data.lastUpdated) }}
        </p>
        <p v-else class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Actividad del repositorio del backend
        </p>
      </div>
      <AppButton variant="secondary" size="sm" icon="activity" :loading="loading" @click="refrescar">
        Refrescar
      </AppButton>
    </div>

    <AppAlert v-if="isDemo" variant="warning" title="Modo demo" class="mt-4">
      {{ data?.warning }} Configurá las variables
      <code class="font-mono">VITE_GITHUB_REPO_OWNER</code> y
      <code class="font-mono">VITE_GITHUB_REPO_NAME</code> para ver datos reales.
    </AppAlert>

    <AppAlert
        v-if="error"
        variant="danger"
        title="No se pudo cargar el dashboard"
        class="mt-4"
    >
      {{ error }}
    </AppAlert>

    <div v-if="loading && !data" class="mt-12 flex items-center justify-center py-16">
      <AppSpinner :size="28" label="Cargando dashboard" />
    </div>

    <template v-else-if="data">
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
            label="Commits"
            :value="String(data.commitsCount)"
            icon="git-commit"
            tone="navy"
            :trend="`últimos ${data.commits.length} mostrados`"
        />
        <MetricCard
            label="Pull requests"
            :value="String(data.pullsCount)"
            icon="git-branch"
            tone="sky"
            :trend="`${data.openPullsCount} abiertas`"
        />
        <MetricCard
            label="Runs (CI)"
            :value="String(data.runsCount)"
            icon="zap"
            tone="emerald"
            :trend="`últimos ${data.runs.length} ejecutados`"
        />
        <MetricCard
            label="Actividad"
            :value="String(data.activity.length)"
            icon="activity"
            tone="amber"
            trend="eventos recientes"
        />
      </div>

      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card class="lg:col-span-2">
          <div class="mb-4 flex items-center gap-3">
            <span
                class="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-100 text-navy-700 dark:bg-navy-500/15 dark:text-navy-200"
            >
              <SvgIcon name="activity" :size="18" aria-hidden="true" />
            </span>
            <div>
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Actividad reciente</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Commits, PRs y runs combinados</p>
            </div>
          </div>

          <ul v-if="data.activity.length > 0" class="space-y-1">
            <li
                v-for="evento in data.activity.slice(0, 10)"
                :key="evento.id"
                class="flex items-start gap-3 rounded-lg px-2 py-2.5 transition hover:bg-slate-50 dark:hover:bg-navy-800/50"
            >
              <span
                  class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  :class="activityMeta[evento.type].tone"
              >
                <SvgIcon :name="activityMeta[evento.type].icon" :size="15" aria-hidden="true" />
              </span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {{ evento.title }}
                </p>
                <p class="truncate text-xs text-slate-500 dark:text-slate-400">
                  {{ evento.subtitle }}
                  <span class="mx-1">·</span>
                  {{ tiempoRelativo(evento.date) }}
                </p>
              </div>
              <Badge :variant="evento.type === 'pull' ? pullBadgeVariant(evento.meta) : 'neutral'">
                {{ activityMeta[evento.type].label }}
              </Badge>
            </li>
          </ul>
          <p v-else class="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Sin actividad reciente en el repositorio.
          </p>
        </Card>

        <div class="space-y-6">
          <Card>
            <div class="mb-3 flex items-center gap-3">
              <span
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300"
              >
                <SvgIcon name="git-branch" :size="18" aria-hidden="true" />
              </span>
              <div>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Repositorio</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ data.repo }}</p>
              </div>
            </div>
            <dl class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <dt class="text-slate-500 dark:text-slate-400">Rama por defecto</dt>
                <dd class="font-mono font-medium text-navy-700 dark:text-navy-200">
                  {{ data.defaultBranch }}
                </dd>
              </div>
              <div class="flex items-center justify-between">
                <dt class="text-slate-500 dark:text-slate-400">Source</dt>
                <dd>
                  <a
                      v-if="data.repoUrl && data.repoUrl !== '#'"
                      :href="data.repoUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="font-medium text-navy-700 hover:underline dark:text-navy-200"
                  >
                    Ver en GitHub
                  </a>
                  <span v-else class="text-slate-400">—</span>
                </dd>
              </div>
              <div class="flex items-center justify-between">
                <dt class="text-slate-500 dark:text-slate-400">Datos</dt>
                <dd>
                  <Badge :variant="data.isDemo ? 'warning' : 'success'" size="sm">
                    {{ data.isDemo ? 'Demo' : 'En vivo' }}
                  </Badge>
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            <div class="mb-3 flex items-center gap-3">
              <span
                  class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
              >
                <SvgIcon name="git-branch" :size="18" aria-hidden="true" />
              </span>
              <div>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Pull requests</h2>
                <p class="text-sm text-slate-500 dark:text-slate-400">Estado actual</p>
              </div>
            </div>
            <ul class="space-y-2">
              <li
                  v-for="pr in data.pulls.slice(0, 4)"
                  :key="pr.id"
                  class="text-sm"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="truncate font-medium text-slate-800 dark:text-slate-200">
                    {{ pr.title }}
                  </span>
                  <Badge :variant="pullBadgeVariant(pr.state)" class="shrink-0">
                    {{ pr.state }}
                  </Badge>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  #{{ pr.number }} · {{ pr.user }} · {{ tiempoRelativo(pr.createdAt) }}
                </p>
              </li>
            </ul>
            <p v-if="data.pulls.length === 0" class="text-sm text-slate-500 dark:text-slate-400">
              Sin pull requests.
            </p>
          </Card>
        </div>
      </div>
    </template>
  </MainLayout>
</template>