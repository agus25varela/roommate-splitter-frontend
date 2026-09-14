<script setup lang="ts">
/**
 * Contenedor base del design system.
 *
 * Usa la paleta marina/gris, sombra y radio consistentes, y soporta dark mode.
 */
withDefaults(
    defineProps<{
        /** Quita el padding del contenido. */
        padless?: boolean
    }>(),
    { padless: false },
)
</script>

<template>
  <div
      class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-navy-800 dark:bg-navy-900"
      :class="padless ? '' : 'p-4 sm:p-6'"
  >
    <slot />
  </div>
</template>