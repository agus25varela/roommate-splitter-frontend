<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <!-- Total Gastado -->
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <h2 class="card-title text-lg">Total Gastado</h2>
        <p class="text-4xl font-bold text-primary">${{ totalGastado.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Mi Aporte -->
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <h2 class="card-title text-lg">Mi Aporte</h2>
        <p class="text-4xl font-bold text-success">${{ miAporte.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Mi Balance -->
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <h2 class="card-title text-lg">Mi Balance</h2>
        <p :class="['text-4xl font-bold', miBalance >= 0 ? 'text-success' : 'text-error']">
          ${{ miBalance.toFixed(2) }}
        </p>
      </div>
    </div>
  </div>

  <!-- Gráfico de gastos por persona -->
  <div class="card bg-base-100 shadow-lg">
    <div class="card-body">
      <h2 class="card-title mb-6">Distribución de Gastos</h2>
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  gastos: Array
})

const totalGastado = computed(() => {
  return props.gastos?.reduce((sum, g) => sum + g.monto, 0) || 0
})

const miAporte = computed(() => {
  return props.gastos?.filter(g => g.quienPago === 'yo').reduce((sum, g) => sum + g.monto, 0) || 0
})

const miBalance = computed(() => {
  return miAporte.value - (totalGastado.value / 3)
})

const yo = computed(() => {
  return props.gastos?.filter(g => g.quienPago === 'yo').reduce((sum, g) => sum + g.monto, 0) || 0
})

const a = computed(() => {
  return props.gastos?.filter(g => g.quienPago === 'roommate_a').reduce((sum, g) => sum + g.monto, 0) || 0
})

const b = computed(() => {
  return props.gastos?.filter(g => g.quienPago === 'roommate_b').reduce((sum, g) => sum + g.monto, 0) || 0
})

const chartData = computed(() => ({
  labels: ['Yo', 'Roommate A', 'Roommate B'],
  datasets: [
    {
      data: [yo.value, a.value, b.value],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
      borderColor: ['#1e40af', '#047857', '#d97706'],
      borderWidth: 2
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `$${context.parsed.toFixed(2)}`
        }
      }
    }
  }
}
</script>