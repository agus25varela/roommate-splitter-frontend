<script setup lang="ts">
/**
 * Tablero de tareas (kanban) del proyecto.
 *
 * Persiste en localStorage sobre key `rs-tareas`; no depende del backend.
 * Columnas: Por hacer / En curso / Hechas.
 */
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import AppInput from '@/components/ui/AppInput.vue'
import SvgIcon from '@/components/ui/SvgIcon.vue'
import { useAuth } from '@/composables/useAuth'

type EstadoTarea = 'todo' | 'doing' | 'done'

interface Tarea {
    id: string
    texto: string
    estado: EstadoTarea
    creadaEn: string
}

const STORAGE_KEY = 'rs-tareas'

const COLUMNAS: { estado: EstadoTarea; label: string; tone: string }[] = [
    { estado: 'todo', label: 'Por hacer', tone: 'bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300' },
    { estado: 'doing', label: 'En curso', tone: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300' },
    { estado: 'done', label: 'Hechas', tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' },
]

const router = useRouter()
const { usuario, cargarUsuario } = useAuth()

const tareas = ref<Tarea[]>([])
const nuevoTexto = ref('')
const textoNuevoError = ref<string | null>(null)

function cargarTareas(): void {
    const guardado = localStorage.getItem(STORAGE_KEY)
    if (!guardado) return
    try {
        tareas.value = JSON.parse(guardado) as Tarea[]
    } catch {
        localStorage.removeItem(STORAGE_KEY)
    }
}

function persistir(): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas.value))
    } catch {
        // Storage lleno o deshabilitado: se ignora.
    }
}

watch(tareas, persistir, { deep: true })

function agregarTarea(): void {
    const texto = nuevoTexto.value.trim()
    if (!texto) {
        textoNuevoError.value = 'Escribí una tarea primero.'
        return
    }
    tareas.value.push({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        texto,
        estado: 'todo',
        creadaEn: new Date().toISOString(),
    })
    nuevoTexto.value = ''
    textoNuevoError.value = null
}

function mover(id: string, direccion: -1 | 1): void {
    const orden: EstadoTarea[] = ['todo', 'doing', 'done']
    const tarea = tareas.value.find((t: Tarea) => t.id === id)
    if (!tarea) return
    const idx = orden.indexOf(tarea.estado)
    const nuevoIdx = idx + direccion
    if (nuevoIdx < 0 || nuevoIdx >= orden.length) return
    tarea.estado = orden[nuevoIdx] as EstadoTarea
}

function eliminarTarea(id: string): void {
    tareas.value = tareas.value.filter((t: Tarea) => t.id !== id)
}

function tareasDe(estado: EstadoTarea): Tarea[] {
    return tareas.value.filter((t: Tarea) => t.estado === estado)
}

onMounted(async () => {
    cargarUsuario()
    if (!usuario.value) {
        await router.push('/login')
        return
    }
    cargarTareas()
})
</script>

<template>
  <MainLayout>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Tareas</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Plan de trabajo del proyecto · {{ tareas.length }} tareas
        </p>
      </div>
    </div>

    <form
        class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start"
        @submit.prevent="agregarTarea"
    >
      <div class="flex-1">
        <AppInput
            v-model="nuevoTexto"
            label="Nueva tarea"
            placeholder="Ej: Revisar PR de balances"
            :error="textoNuevoError ?? undefined"
            hide-label
        />
      </div>
      <button
          type="submit"
          class="inline-flex items-center gap-2 rounded-lg bg-navy-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-navy-800 focus-visible:ring-2 focus-visible:ring-navy-400 focus-visible:ring-offset-2 focus-visible:outline-none dark:hover:bg-navy-600"
      >
        <SvgIcon name="plus" :size="15" aria-hidden="true" />
        Agregar
      </button>
    </form>

    <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
      <section v-for="col in COLUMNAS" :key="col.estado" :aria-label="col.label">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
            {{ col.label }}
          </h2>
          <Badge variant="neutral" size="sm">{{ tareasDe(col.estado).length }}</Badge>
        </div>
        <Card class="min-h-40">
          <ul v-if="tareasDe(col.estado).length > 0" class="space-y-2">
            <li
                v-for="tarea in tareasDe(col.estado)"
                :key="tarea.id"
                class="rounded-lg border border-slate-200 p-3 dark:border-navy-700"
            >
              <div class="flex items-start justify-between gap-2">
                <p class="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {{ tarea.texto }}
                </p>
                <button
                    type="button"
                    class="shrink-0 rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                    aria-label="Eliminar tarea"
                    @click="eliminarTarea(tarea.id)"
                >
                  <SvgIcon name="trash" :size="14" aria-hidden="true" />
                </button>
              </div>
              <div class="mt-2 flex items-center gap-1">
                <button
                    v-if="col.estado !== 'todo'"
                    type="button"
                    class="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-navy-800"
                    @click="mover(tarea.id, -1)"
                >
                  <SvgIcon name="arrow-left" :size="12" aria-hidden="true" />
                  Atrás
                </button>
                <button
                    v-if="col.estado !== 'done'"
                    type="button"
                    class="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-navy-700 transition hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-800"
                    @click="mover(tarea.id, 1)"
                >
                  Avanzar
                  <SvgIcon name="chevron-right" :size="12" aria-hidden="true" />
                </button>
              </div>
            </li>
          </ul>
          <p v-else class="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
            Sin tareas
          </p>
        </Card>
      </section>
    </div>
  </MainLayout>
</template>