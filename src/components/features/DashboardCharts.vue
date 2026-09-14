<script setup lang="ts">
/**
 * Gráficos y métricas del dashboard de gastos.
 *
 * Muestra total, aporte propio, balance personal y un doughnut de la
 * distribución por persona. Reescrito con la paleta del design system.
 */
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { ChartOptions } from 'chart.js'
import { QUIEN_PAGO_LABEL, type Gasto, type QuienPago } from '@/types/gasto'
import MetricCard from '@/components/ui/MetricCard.vue'
import Card from '@/components/ui/Card.vue'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
    gasto: Gasto[]
}>()

const CHART_COLORS: Record<QuienPago, { bg: string; border: string }> = {
    yo: { bg: '#294672', border: '#162742' },
    roommate_a: { bg: '#10b981', border: '#047857' },
    roommate_b: { bg: '#f59e0b', border: '#b45309' },
}

const NUM_PERSONAS = 3

const totalGastado = computed<number>(() =>
    props.gasto.reduce((sum: number, g: Gasto): number => sum + g.monto, 0),
)

const aportePorPersona = computed<Record<QuienPago, number>>(() => {
    const acc: Record<QuienPago, number> = {
        yo: 0,
        roommate_a: 0,
        roommate_b: 0,
    }
    for (const g of props.gasto) {
        const key = g.quienPago as QuienPago
        if (key in acc) {
            acc[key] += g.monto
        }
    }
    return acc
})

const miBalance = computed<number>(() =>
    aportePorPersona.value.yo - totalGastado.value / NUM_PERSONAS,
)

const chartData = computed(() => {
    const personas = Object.keys(aportePorPersona.value) as QuienPago[]
    return {
        labels: personas.map((p: QuienPago) => QUIEN_PAGO_LABEL[p]),
        datasets: [
            {
                data: personas.map((p: QuienPago) => aportePorPersona.value[p]),
                backgroundColor: personas.map((p: QuienPago) => CHART_COLORS[p].bg),
                borderColor: personas.map((p: QuienPago) => CHART_COLORS[p].border),
                borderWidth: 2,
            },
        ],
    }
})

const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                boxWidth: 8,
            },
        },
        tooltip: {
            callbacks: {
                label: (context): string => `$${Number(context.parsed).toFixed(2)}`,
            },
        },
    },
}
</script>

<template>
  <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
    <MetricCard
        label="Total gastado"
        :value="`$${totalGastado.toFixed(2)}`"
        icon="wallet"
        tone="navy"
        :loading="false"
    />
    <MetricCard
        label="Mi aporte"
        :value="`$${aportePorPersona.yo.toFixed(2)}`"
        icon="bar-chart"
        tone="sky"
    />
    <MetricCard
        label="Mi balance"
        :value="`$${miBalance.toFixed(2)}`"
        icon="activity"
        :tone="miBalance >= 0 ? 'emerald' : 'red'"
        :trend="miBalance >= 0 ? 'A favor de mi bolsillo' : 'Debo a mis compañeros'"
    />
  </div>

  <Card>
    <div class="mb-4 flex items-center gap-3">
      <h2 class="text-xl font-bold text-slate-900 dark:text-white">Distribución de gastos</h2>
      <p class="text-sm text-slate-500 dark:text-slate-400">Por persona</p>
    </div>
    <div v-if="gasto.length === 0" class="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
      Agregá gastos para ver la distribución.
    </div>
    <div v-else class="relative mx-auto h-64 w-full max-w-sm">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </Card>
</template>