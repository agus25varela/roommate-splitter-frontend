<script setup lang="ts">
/**
 * Tarjeta de métrica para dashboards.
 *
 * Muestra label, valor grande y un ícono; opcionalmente un `trend` textual y
 * un color de acento (`sky`, `emerald`, `amber`, `red`, `slate`).
 */
import SvgIcon from './SvgIcon.vue'

export type MetricTone = 'sky' | 'emerald' | 'amber' | 'red' | 'slate' | 'navy'

withDefaults(
    defineProps<{
        label: string
        value: string
        icon?: string
        trend?: string
        tone?: MetricTone
        loading?: boolean
    }>(),
    {
        icon: undefined,
        trend: undefined,
        tone: 'sky',
        loading: false,
    },
)

const toneClasses: Record<MetricTone, string> = {
    sky: 'text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-500/10',
    emerald: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10',
    amber: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/10',
    red: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-500/10',
    slate: 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-500/10',
    navy: 'text-navy-700 dark:text-navy-200 bg-navy-100 dark:bg-navy-500/10',
}
</script>

<template>
  <Card>
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <p class="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {{ label }}
        </p>
        <p
            v-if="loading"
            class="mt-1 h-7 w-24 animate-pulse rounded bg-slate-200 dark:bg-navy-800"
            aria-hidden="true"
        />
        <p v-else class="mt-1 truncate text-3xl font-bold text-slate-900 dark:text-white">
          {{ value }}
        </p>
        <p v-if="trend" class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ trend }}</p>
      </div>
      <span
          v-if="icon"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          :class="toneClasses[tone]"
      >
        <SvgIcon :name="icon" :size="20" aria-hidden="true" />
      </span>
    </div>
  </Card>
</template>