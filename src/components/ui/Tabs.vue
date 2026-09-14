<script setup lang="ts">
/**
 * Pestañas accesibles (modelo v-model) con selección por teclado
 * (arrow keys + rol `tablist`/`tab`/`tabpanel`).
 */
import { ref, watch } from 'vue'

export interface AppTabItem {
    key: string
    label: string
    icon?: string
    disabled?: boolean
}

const props = withDefaults(
    defineProps<{
        tabs: AppTabItem[]
        modelValue: string
        ariaLabel?: string
    }>(),
    {
        ariaLabel: 'Secciones',
    },
)

const emit = defineEmits<{
    (e: 'update:modelValue', key: string): void
}>()

const activeIndex = ref(Math.max(0, props.tabs.findIndex((t) => t.key === props.modelValue)))

watch(
    () => props.modelValue,
    (value) => {
        const idx = props.tabs.findIndex((t) => t.key === value)
        activeIndex.value = idx >= 0 ? idx : 0
    },
)

function select(index: number): void {
    const tab = props.tabs[index]
    if (tab && !tab.disabled) {
        emit('update:modelValue', tab.key)
    }
}

function onKeydown(event: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    let next = activeIndex.value
    if (event.key === 'ArrowRight') next = (next + 1) % props.tabs.length
    else if (event.key === 'ArrowLeft') next = (next - 1 + props.tabs.length) % props.tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = props.tabs.length - 1
    select(next)
}
</script>

<template>
  <div>
    <div role="tablist" :aria-label="ariaLabel" class="flex gap-6 border-b border-slate-200 dark:border-navy-800">
      <button
          v-for="(tab, idx) in tabs"
          :id="`tab-${tab.key}`"
          :key="tab.key"
          type="button"
          role="tab"
          :aria-selected="activeIndex === idx"
          :aria-controls="`panel-${tab.key}`"
          :tabindex="activeIndex === idx ? 0 : -1"
          :disabled="tab.disabled"
          class="relative -mb-px flex items-center gap-2 border-b-2 px-2 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-400 disabled:cursor-not-allowed disabled:opacity-50"
          :class="
            activeIndex === idx
              ? 'border-navy-600 text-navy-700 dark:border-navy-400 dark:text-navy-200'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          "
          @click="select(idx)"
          @keydown="onKeydown"
      >
        <svg
            v-if="tab.icon"
            :width="15"
            :height="15"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
          <use :href="`/icons.svg#${tab.icon}`" />
        </svg>
        {{ tab.label }}
      </button>
    </div>
    <div
        v-for="tab in tabs"
        :id="`panel-${tab.key}`"
        :key="tab.key"
        role="tabpanel"
        :aria-labelledby="`tab-${tab.key}`"
        class="pt-4 focus-visible:outline-none"
        :class="tab.key === tabs[activeIndex]?.key ? '' : 'hidden'"
        :tabindex="tab.key === tabs[activeIndex]?.key ? 0 : -1"
    >
      <slot :name="`panel-${tab.key}`" />
    </div>
  </div>
</template>