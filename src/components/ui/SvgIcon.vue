<script setup lang="ts">
/**
 * Icono SVG minimalista desde el sprite `public/icons.svg`.
 *
 * El icono es decorativo por defecto (`aria-hidden`), pero se puede sobrescribir
 * con un aria-label o role en caso de que tenga significado propio.
 */
withDefaults(
    defineProps<{
        name: string
        size?: number | string
    }>(),
    {
        size: 20,
    },
)
</script>

<template>
  <svg
      :width="size"
      :height="size"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
      v-bind="$attrs"
  >
    <use :href="`/icons.svg#${name}`" />
  </svg>
</template>