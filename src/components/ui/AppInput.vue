<script setup lang="ts">
/**
 * Campo de texto del design system (v-model).
 *
 * Incluye label asociada, hint, mensaje de error accesible (`aria-describedby`)
 * y estado inválido (`aria-invalid`).
 */
import { computed, useId } from 'vue'

const props = withDefaults(
    defineProps<{
        modelValue: string
        label?: string
        type?: string
        placeholder?: string
        hint?: string
        error?: string
        disabled?: boolean
        required?: boolean
    }>(),
    {
        label: undefined,
        type: 'text',
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
const inputId = `input-${uid}`
const describedBy = computed<string | undefined>(() => {
    const ids: string[] = []
    if (props.hint) ids.push(`hint-${uid}`)
    if (props.error) ids.push(`err-${uid}`)
    return ids.length > 0 ? ids.join(' ') : undefined
})

function onInput(event: Event): void {
    emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div>
    <label v-if="label" :for="inputId" class="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
      {{ label }}
    </label>
    <input
        :id="inputId"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :aria-invalid="!!error || undefined"
        :aria-describedby="describedBy"
        class="w-full rounded-lg border px-4 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-navy-800 dark:text-slate-100"
        :class="
          error
            ? 'border-red-400 focus:ring-red-300 dark:border-red-500'
            : 'border-slate-300 focus:ring-navy-300 dark:border-navy-700'
        "
        @input="onInput"
    />
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