<script setup lang="ts">
/**
 * Interruptor (switch) accesible para booleans (modelo v-model).
 */
const props = withDefaults(
    defineProps<{
        modelValue: boolean
        label?: string
        disabled?: boolean
    }>(),
    {
        label: undefined,
        disabled: false,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

/**
 * Alterna el valor emitiendo el evento de actualización.
 */
function toggle(): void {
    if (!props.disabled) {
        emit('update:modelValue', !props.modelValue)
    }
}
</script>

<template>
  <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      :aria-label="label"
      :disabled="disabled"
      class="inline-flex h-6 w-11 items-center rounded-full p-1 transition-colors focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      :class="modelValue ? 'bg-navy-600 dark:bg-navy-500' : 'bg-slate-300 dark:bg-slate-600'"
      @click="toggle"
  >
    <span
        class="block h-4 w-4 rounded-full bg-white shadow transition-transform"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
    />
  </button>
</template>