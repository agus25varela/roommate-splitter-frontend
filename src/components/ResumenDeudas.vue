<template>
  <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-lg p-6 border-2 border-orange-200">
    <h2 class="text-2xl font-bold text-orange-600 mb-6">📊 Resumen de Deudas</h2>

    <div v-if="balances.length === 0" class="text-center py-6">
      <p class="text-slate-600 text-lg">✓ Todos pagaron el mismo monto. ¡Balances en 0!</p>
    </div>

    <div v-else class="space-y-3">
      <div
          v-for="balance in balances"
          :key="`${balance.from}-${balance.to}`"
          class="bg-white rounded-lg p-4 border-l-4 border-orange-400 shadow-sm hover:shadow-md transition"
      >
        <p class="text-slate-700">
          <span class="font-bold text-slate-800">{{ balance.from }}</span>
          <span class="text-slate-500"> le debe </span>
          <span class="font-bold text-orange-600 text-lg">${{ balance.amount.toFixed(2) }}</span>
          <span class="text-slate-500"> a </span>
          <span class="font-bold text-slate-800">{{ balance.to }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  balances: Array
})
</script>