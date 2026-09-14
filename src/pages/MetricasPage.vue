<script setup lang="ts">
/**
 * Métricas del proyecto en gráficos.
 *
 * Commits por día (últimos 14 días), PRs por estado y runs por conclusión,
 * alimentados por el dashboard de GitHub.
 */
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import type { ChartOptions } from 'chart.js'
import MainLayout from '@/layout/MainLayout.vue'
import Card from '@/components/ui/Card.vue'
import MetricCard from '@/components/ui/MetricCard.vue'
import AppAlert from '@/components/ui/AppAlert.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useDashboard } from '@/composables/useDashboard'
import { useAuth } from '@/composables/useAuth'
import type { GithubPull, GithubRun } from '@/types'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const router = useRouter()
const { usuario, cargarUsuario } = useAuth()
const { data, loading, isDemo, error, cargar, refrescar } = useDashboard()

const NAVY = '#294672'
const SKY = '#0ea5e9'
const EMERALD = '#10b981'
const AMBER = '#f59e0b'
const RED = '#ef4444'
const SLATE = '#94a3b8'

const dias = computed<string[]>(() => {
    const out: string[] = []
    const today = new Date()
    for (let i = 13; i >= 0; i -= 1) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        out.push(d.toISOString().slice(0, 10))
    }
    return out
})

const commitsPorDia = computed<number[]>(() => {
    const diasMap = new Map(dias.value.map((d: string): [string, number] => [d, 0]))
    for (const commit of data.value?.commits ?? []) {
        const day = commit.date.slice(0, 10)
        if (diasMap.has(day)) {
            diasMap.set(day, (diasMap.get(day) ?? 0) + 1)
        }
    }
    return dias.value.map((d: string) => diasMap.get(d) ?? 0)
})

const pullsPorEstado = computed<{ label: string; count: number; color: string }[]>(() => {
    const pulls = data.value?.pulls ?? []
    return [
        { label: 'Abiertas', count: pulls.filter((p: GithubPull) => p.state === 'open').length, color: AMBER },
        { label: 'Merged', count: pulls.filter((p: GithubPull) => p.state === 'merged').length, color: EMERALD },
        { label: 'Cerradas', count: pulls.filter((p: GithubPull) => p.state === 'closed').length, color: SLATE },
    ]
})

const runsPorConclusion = computed<{ label: string; count: number; color: string }[]>(() => {
    const runs = data.value?.runs ?? []
    const conteo = new Map<string, number>()
    for (const r of runs) {
        const key = r.status === 'completed' ? (r.conclusion ?? 'sin conclusión') : 'en ejecución'
        conteo.set(key, (conteo.get(key) ?? 0) + 1)
    }
    const colores: Record<string, string> = {
        success: EMERALD,
        failure: RED,
        cancelled: SLATE,
        'en ejecución': SKY,
    }
    return Array.from(conteo.entries()).map(([label, count]) => ({
        label,
        count,
        color: colores[label] ?? NAVY,
    }))
})

const prsExitosas = computed<number>(
    () => pullsPorEstado.value.find((p) => p.label === 'Merged')?.count ?? 0,
)

const runsOk = computed<number>(
    () => runsPorConclusion.value.find((r) => r.label === 'success')?.count ?? 0,
)

const chartDataCommits = computed(() => ({
    labels: dias.value.map((d: string) => d.slice(5)),
    datasets: [
        {
            label: 'Commits por día',
            data: commitsPorDia.value,
            backgroundColor: NAVY,
            borderRadius: 4,
        },
    ],
}))

const chartDataPulls = computed(() => ({
    labels: pullsPorEstado.value.map((p) => p.label),
    datasets: [
        {
            data: pullsPorEstado.value.map((p) => p.count),
            backgroundColor: pullsPorEstado.value.map((p) => p.color),
            borderWidth: 2,
        },
    ],
}))

const chartDataRuns = computed(() => ({
    labels: runsPorConclusion.value.map((r) => r.label),
    datasets: [
        {
            label: 'Runs por conclusión',
            data: runsPorConclusion.value.map((r) => r.count),
            backgroundColor: runsPorConclusion.value.map((r) => r.color),
            borderRadius: 4,
        },
    ],
}))

const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
    },
    scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { precision: 0 } },
    },
}

const doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: { usePointStyle: true, boxWidth: 8 },
        },
    },
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
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Métricas</h1>
        <p v-if="data" class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{ data.repo }} · actividad del repositorio
        </p>
      </div>
      <AppButton variant="secondary" size="sm" icon="activity" :loading="loading" @click="refrescar">
        Refrescar
      </AppButton>
    </div>

    <AppAlert v-if="isDemo" variant="warning" title="Modo demo" class="mt-4">
      {{ data?.warning }}
    </AppAlert>

    <div v-if="loading && !data" class="mt-12 flex items-center justify-center py-16">
      <AppSpinner :size="28" label="Cargando métricas" />
    </div>

    <template v-else-if="data">
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
            label="PRs merged"
            :value="String(prsExitosas)"
            icon="git-branch"
            tone="emerald"
            :trend="`de ${data.pullsCount} totales`"
        />
        <MetricCard
            label="Runs exitosos"
            :value="String(runsOk)"
            icon="zap"
            tone="emerald"
            :trend="`de ${data.runsCount} ejecutados`"
        />
        <MetricCard
            label="PRs abiertas"
            :value="String(data.openPullsCount)"
            icon="git-branch"
            tone="amber"
        />
      </div>

      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 class="mb-4 text-xl font-bold text-slate-900 dark:text-white">Commits por día</h2>
          <div class="relative h-64">
            <Bar :data="chartDataCommits" :options="barOptions" />
          </div>
        </Card>

        <Card>
          <h2 class="mb-4 text-xl font-bold text-slate-900 dark:text-white">PRs por estado</h2>
          <div class="relative mx-auto h-64 w-full max-w-xs">
            <Doughnut :data="chartDataPulls" :options="doughnutOptions" />
          </div>
        </Card>

        <Card class="lg:col-span-2">
          <h2 class="mb-4 text-xl font-bold text-slate-900 dark:text-white">Runs (CI) por conclusión</h2>
          <div class="relative h-56">
            <Bar :data="chartDataRuns" :options="barOptions" />
          </div>
        </Card>
      </div>
    </template>
  </MainLayout>
</template>