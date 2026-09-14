<script setup lang="ts">
/**
 * Resumen de deudas/balances entre roommates.
 *
 * Consume el contrato real del backend: `BalanceDTO[]` con
 * `{ deudor, acreedor, monto }`.
 */
import { QUIEN_PAGO_LABEL, type QuienPago } from '@/types/gasto'
import type { BalanceDTO } from '@/types'
import Card from '@/components/ui/Card.vue'
import SvgIcon from '@/components/ui/SvgIcon.vue'

defineProps<{
    deuda: BalanceDTO[]
}>()

/**
 * Traduce el identificador de persona a una etiqueta legible.
 *
 * @param persona identificador `yo` | `roommate_a` | `roommate_b` o libre.
 * @returns etiqueta a mostrar.
 */
function personaLabel(persona: string): string {
    if (persona in QUIEN_PAGO_LABEL) {
        return QUIEN_PAGO_LABEL[persona as QuienPago]
    }
    return persona
}
</script>

<template>
  <Card>
    <div class="mb-4 flex items-center gap-3">
      <span
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
      >
        <SvgIcon name="activity" :size="18" aria-hidden="true" />
      </span>
      <h2 class="text-xl font-bold text-slate-900 dark:text-white">Resumen de deudas</h2>
    </div>

    <div v-if="deuda.length === 0" class="py-6 text-center">
      <SvgIcon name="check-circle" :size="28" class="mx-auto text-emerald-500" aria-hidden="true" />
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Todos pagaron el mismo monto. ¡Balances en 0!
      </p>
    </div>

    <ul v-else class="space-y-3">
      <li
          v-for="(balance, idx) in deuda"
          :key="`${balance.deudor}-${balance.acreedor}-${idx}`"
          class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-navy-700 dark:bg-navy-800/60"
      >
        <p class="text-sm text-slate-700 dark:text-slate-300">
          <span class="font-semibold text-slate-900 dark:text-white">
            {{ personaLabel(balance.deudor) }}
          </span>
          le debe
          <span class="font-bold text-emerald-700 dark:text-emerald-300">
            ${{ balance.monto.toFixed(2) }}
          </span>
          a
          <span class="font-semibold text-slate-900 dark:text-white">
            {{ personaLabel(balance.acreedor) }}
          </span>
        </p>
      </li>
    </ul>
  </Card>
</template>