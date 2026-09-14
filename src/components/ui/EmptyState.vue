<script setup lang="ts">
/**
 * Estado vacío: icono + título + descripción + slot de acción opcional.
 */
import SvgIcon from './SvgIcon.vue'

withDefaults(
    defineProps<{
        icon?: string
        title: string
        description?: string
    }>(),
    {
        icon: 'info',
        description: undefined,
    },
)
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center">
    <span
        class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-navy-800 dark:text-slate-500"
    >
      <SvgIcon :name="icon" :size="24" aria-hidden="true" />
    </span>
    <h3 class="text-base font-semibold text-slate-800 dark:text-slate-200">{{ title }}</h3>
    <p v-if="description" class="max-w-sm text-sm text-slate-500 dark:text-slate-400">
      {{ description }}
    </p>
    <slot />
  </div>
</template>