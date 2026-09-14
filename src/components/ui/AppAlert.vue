<script setup lang="ts">
/**
 * Alerta/banner con variantes semánticas.
 *
 * `danger` y `success` usan `role="alert"` (lectores de pantalla anuncian el
 * contenido); el resto usa `role="status"`.
 */
import SvgIcon from './SvgIcon.vue'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

withDefaults(
    defineProps<{
        variant?: AlertVariant
        title?: string
        dismissible?: boolean
    }>(),
    {
        variant: 'info',
        title: undefined,
        dismissible: false,
    },
)

const emit = defineEmits<{
    (e: 'dismiss'): void
}>()

const config: Record<
    AlertVariant,
    { icon: string; wrapper: string; titleText: string; role: 'alert' | 'status' }
> = {
    info: {
        icon: 'info',
        wrapper:
            'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-500/10 dark:text-sky-200 dark:border-sky-500/30',
        titleText: 'text-sky-900 dark:text-sky-100',
        role: 'status',
    },
    success: {
        icon: 'check-circle',
        wrapper:
            'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-500/30',
        titleText: 'text-emerald-900 dark:text-emerald-100',
        role: 'alert',
    },
    warning: {
        icon: 'warning',
        wrapper:
            'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-200 dark:border-amber-500/30',
        titleText: 'text-amber-900 dark:text-amber-100',
        role: 'status',
    },
    danger: {
        icon: 'error',
        wrapper:
            'bg-red-50 text-red-800 border-red-200 dark:bg-red-500/10 dark:text-red-200 dark:border-red-500/30',
        titleText: 'text-red-900 dark:text-red-100',
        role: 'alert',
    },
}
</script>

<template>
  <div
      :role="config[variant].role"
      class="flex items-start gap-3 rounded-lg border px-4 py-3 text-sm"
      :class="config[variant].wrapper"
  >
    <SvgIcon :name="config[variant].icon" :size="18" class="mt-0.5 shrink-0" aria-hidden="true" />
    <div class="min-w-0 flex-1">
      <p v-if="title" class="font-semibold mt-px" :class="config[variant].titleText">{{ title }}</p>
      <slot />
    </div>
    <button
        v-if="dismissible"
        type="button"
        class="shrink-0 rounded p-1 opacity-70 transition hover:opacity-100"
        aria-label="Descartar aviso"
        @click="emit('dismiss')"
    >
      <SvgIcon name="close" :size="15" aria-hidden="true" />
    </button>
  </div>
</template>