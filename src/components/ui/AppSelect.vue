<script setup lang="ts">
/**
 * Selector del design system (v-model) con label y opciones tipadas.
 */
import { computed, useId } from 'vue'

export interface AppSelectOption {
    value: string
    label: string
}

const props = withDefaults(
    defineProps<{
        modelValue: string
        label?: string
        options?: AppSelectOption[]
        placeholder?: string
        hint?: string
        error?: string
        disabled?: boolean
        required?: boolean
    }>(),
    {
        label: undefined,
        options: () => [],
        placeholder: undefined,
        hint: undefined,
        error: undefined,
        disabled: false,
        required: false,
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const uid = useId()
const selectId = `select-${uid}`
const describedBy = computed<string | undefined>(() => {
    const ids: string[] = []
    if (props.hint) ids.push(`hint-${uid}`)
    if (props.error) ids.push(`err-${uid}`)
    return ids.length > 0 ? ids.join(' ') : undefined
})

function onInput(event: Event): void {
    emit('update:modelValue', (event.target as HTMLSelectElement).value)
}
</script>

<template>
  <div>
    <label v-if="label" :for="selectId" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
      {{ label }}
    </label>
    <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :aria-invalid="!!error || undefined"
        :aria-describedby="describedBy"
        class="w-full appearance-none rounded-lg border bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-navy-800 dark:text-slate-100"
        :class="
          error
            ? 'border-red-400 focus:ring-red-300 dark:border-red-500'
            : 'border-slate-300 focus:ring-navy-300 dark:border-navy-700'
        "
        @input="onInput"
    >
      <option v-if="placeholder" value="" disabled>
        {{ placeholder }}
      </option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <p v-if="hint" :id="`hint-${uid}`" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
      {{ hint }}
    </p>
    <p
        v-if="error"
        :id="`err-${uid}`"
        class="mt-1 text-xs font-medium text-red-600 dark:text-red-400"
        role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>