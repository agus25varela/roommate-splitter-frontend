<script setup lang="ts">
/**
 * Etiqueta de estado (badge) con variantes de color semánticas.
 */
export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'primary'

withDefaults(
    defineProps<{
        variant?: BadgeVariant
        size?: 'sm' | 'md'
    }>(),
    {
        variant: 'neutral',
        size: 'sm',
    },
)

const variantClasses: Record<BadgeVariant, string> = {
    neutral: 'bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300',
    success:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
    warning:
        'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
    info: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
    primary: 'bg-navy-100 text-navy-800 dark:bg-navy-500/20 dark:text-navy-200',
}
</script>

<template>
  <span
      class="inline-flex items-center gap-1 rounded-full font-medium"
      :class="[variantClasses[variant], size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm']"
  >
    <slot />
  </span>
</template>