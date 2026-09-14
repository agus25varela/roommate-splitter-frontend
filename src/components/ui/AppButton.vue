<script setup lang="ts">
/**
 * Botón base del design system.
 *
 * Variantes: `primary` (marino), `secondary` (plata), `ghost`, `danger`, `success`.
 * Soporta estado de carga con spinner y modo `block`.
 */
import AppSpinner from './AppSpinner.vue'

export type AppButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
export type AppButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
    defineProps<{
        variant?: AppButtonVariant
        size?: AppButtonSize
        loading?: boolean
        disabled?: boolean
        block?: boolean
        type?: 'button' | 'submit' | 'reset'
        /** Icono opcional mostrado a la izquierda del label. */
        icon?: string
    }>(),
    {
        variant: 'primary',
        size: 'md',
        loading: false,
        disabled: false,
        block: false,
        type: 'button',
        icon: undefined,
    },
)

const variantClasses: Record<AppButtonVariant, string> = {
    primary:
        'bg-navy-700 text-white hover:bg-navy-800 focus-visible:ring-navy-400 dark:hover:bg-navy-600',
    secondary:
        'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-navy-800 dark:text-slate-200 dark:hover:bg-navy-700',
    ghost:
        'bg-transparent text-navy-700 hover:bg-navy-100 dark:text-navy-100 dark:hover:bg-navy-900',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-400',
}

const sizeClasses: Record<AppButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs gap-2',
    md: 'px-4 py-2 text-sm gap-3',
    lg: 'px-5 py-3 text-base gap-3',
}
</script>

<template>
  <button
      class="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      :class="[variantClasses[props.variant], sizeClasses[props.size], { 'w-full': props.block }]"
      :type="props.type"
      :disabled="props.disabled || props.loading"
      :aria-busy="props.loading || undefined"
  >
    <AppSpinner v-if="props.loading" :size="14" aria-hidden="true" label="" />
    <template v-else-if="props.icon">
      <svg
          v-if="props.icon"
          :width="size === 'sm' ? 14 : 16"
          :height="size === 'sm' ? 14 : 16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
      >
        <use :href="`/icons.svg#${props.icon}`" />
      </svg>
    </template>
    <span v-if="$slots.default"><slot /></span>
  </button>
</template>