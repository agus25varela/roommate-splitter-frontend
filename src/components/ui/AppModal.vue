<script setup lang="ts">
/**
 * Modal accesible (WCAG AA):
 * - `role=dialog` + `aria-modal`, foco inicial en el panel.
 * - Cierre con `Esc`, overlay clicable, y trampa de foco con Tab.
 * - Restaura el foco al elemento anterior al cerrar.
 */
import { onBeforeUnmount, ref, watch } from 'vue'
import SvgIcon from './SvgIcon.vue'

const props = withDefaults(
    defineProps<{
        open: boolean
        title: string
        closeOnOverlay?: boolean
    }>(),
    { closeOnOverlay: true },
)

const emit = defineEmits<{
    (e: 'close'): void
}>()

const panelRef = ref<HTMLElement | null>(null)
let previousFocus: HTMLElement | null = null

function close(): void {
    emit('close')
}

/**
 * Cierra con Escape y mantiene el foco dentro del panel.
 */
function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        close()
    } else if (event.key === 'Tab') {
        trapFocus(event)
    }
}

function trapFocus(event: KeyboardEvent): void {
    const panel = panelRef.value
    if (!panel) return
    const focusables = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
    }
}

watch(
    () => props.open,
    (open) => {
        if (open) {
            previousFocus = document.activeElement as HTMLElement | null
            document.addEventListener('keydown', onKeydown)
            requestAnimationFrame(() => panelRef.value?.focus())
        } else {
            document.removeEventListener('keydown', onKeydown)
            previousFocus?.focus?.()
            previousFocus = null
        }
    },
)

onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
          v-if="open"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="presentation"
      >
        <div class="absolute inset-0 bg-slate-900/60 dark:bg-black/70" @click="closeOnOverlay && close()" />
        <div
            ref="panelRef"
            role="dialog"
            aria-modal="true"
            :aria-label="title"
            tabindex="-1"
            class="relative w-full max-w-lg outline-none rounded-xl border border-slate-200 bg-white shadow-xl dark:border-navy-800 dark:bg-navy-900"
        >
          <div
              class="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-3 dark:border-navy-800"
          >
            <h2 class="text-lg font-bold text-slate-900 dark:text-white">{{ title }}</h2>
            <button
                type="button"
                class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-navy-800 dark:hover:text-slate-200"
                aria-label="Cerrar"
                @click="close"
            >
              <SvgIcon name="close" :size="18" aria-hidden="true" />
            </button>
          </div>
          <div class="max-h-[70vh] overflow-y-auto px-5 py-4">
            <slot />
          </div>
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.15s ease;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>