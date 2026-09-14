<script setup lang="ts">
/**
 * Tabla de gastos con filtros (búsqueda de texto y por persona) y edición en línea.
 */
import { computed, ref } from 'vue'
import { QUIEN_PAGO_LABEL, type Gasto, type QuienPago } from '@/types/gasto'
import EmptyState from '@/components/ui/EmptyState.vue'
import SvgIcon from '@/components/ui/SvgIcon.vue'

const props = defineProps<{
    gastos: Gasto[]
    editandoId: number | null
    gastoEnEdicion: Partial<Gasto>
}>()

const emit = defineEmits<{
    (e: 'editar', gasto: Gasto): void
    (e: 'guardar', id: number): void
    (e: 'cancelar'): void
    (e: 'eliminar', id: number): void
}>()

const busqueda = ref('')
const filtroPersona = ref<string>('')

const filtrosDisponibles: QuienPago[] = ['yo', 'roommate_a', 'roommate_b']

const gastosFiltrados = computed<Gasto[]>(() => {
    const q = busqueda.value.trim().toLowerCase()
    const persona = filtroPersona.value
    return props.gastos.filter((g: Gasto) => {
        const matchText = !q || g.descripcion.toLowerCase().includes(q)
        const matchPersona = !persona || g.quienPago === persona
        return matchText && matchPersona
    })
})

function personaLabel(persona: string): string {
    return QUIEN_PAGO_LABEL[persona as QuienPago] ?? persona
}

const chipTone = (persona: string): string => {
    switch (persona) {
        case 'yo':
            return 'bg-navy-100 text-navy-800 dark:bg-navy-800 dark:text-navy-200'
        case 'roommate_a':
            return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300'
        case 'roommate_b':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300'
        default:
            return 'bg-slate-100 text-slate-700 dark:bg-navy-800 dark:text-slate-300'
    }
}

function limpiarFiltros(): void {
    busqueda.value = ''
    filtroPersona.value = ''
}
</script>

<template>
  <Card padless>
    <div class="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-navy-800 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Gastos</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          {{ gastosFiltrados.length }} de {{ gastos.length }} gastos
        </p>
      </div>

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div class="relative">
          <input
              v-model="busqueda"
              type="search"
              class="w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-navy-300 sm:w-56 dark:border-navy-700 dark:bg-navy-800 dark:text-slate-100"
              placeholder="Buscar gasto…"
              aria-label="Buscar por descripción"
          />
        </div>
        <select
            v-model="filtroPersona"
            class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-navy-300 sm:w-40 dark:border-navy-700 dark:bg-navy-800 dark:text-slate-100"
            aria-label="Filtrar por persona"
        >
          <option value="">Todas las personas</option>
          <option v-for="p in filtrosDisponibles" :key="p" :value="p">
            {{ personaLabel(p) }}
          </option>
        </select>
        <button
            v-if="busqueda || filtroPersona"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-navy-800"
            @click="limpiarFiltros"
        >
          <SvgIcon name="close" :size="14" aria-hidden="true" />
          Limpiar
        </button>
      </div>
    </div>

    <div v-if="gastosFiltrados.length === 0" class="p-6">
      <EmptyState
          icon="wallet"
          title="Sin gastos"
          :description="
            busqueda || filtroPersona
              ? 'No hay gastos que coincidan con los filtros.'
              : 'Todavía no registraste gastos.'
          "
      >
        <button
            v-if="busqueda || filtroPersona"
            type="button"
            class="mt-2 text-sm font-semibold text-navy-700 hover:underline dark:text-navy-200"
            @click="limpiarFiltros"
        >
          Limpiar filtros
        </button>
      </EmptyState>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-left dark:bg-navy-800">
          <tr>
            <th scope="col" class="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Descripción</th>
            <th scope="col" class="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Monto</th>
            <th scope="col" class="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Quién pagó</th>
            <th scope="col" class="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Fecha</th>
            <th scope="col" class="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-navy-800">
          <tr
              v-for="gasto in gastosFiltrados"
              :key="gasto.id"
              class="transition hover:bg-slate-50 dark:hover:bg-navy-800/50"
          >
            <td class="px-4 py-3">
              <span v-if="editandoId !== gasto.id">{{ gasto.descripcion }}</span>
              <input
                  v-else
                  v-model="gastoEnEdicion.descripcion"
                  type="text"
                  class="w-full rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:ring-2 focus:ring-navy-300 dark:border-navy-700 dark:bg-navy-800 dark:text-slate-100"
                  aria-label="Editar descripción"
              />
            </td>

            <td class="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
              <span v-if="editandoId !== gasto.id">${{ gasto.monto.toFixed(2) }}</span>
              <input
                  v-else
                  v-model.number="gastoEnEdicion.monto"
                  type="number"
                  step="0.01"
                  class="w-28 rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:ring-2 focus:ring-navy-300 dark:border-navy-700 dark:bg-navy-800 dark:text-slate-100"
                  aria-label="Editar monto"
              />
            </td>

            <td class="px-4 py-3">
              <span v-if="editandoId !== gasto.id">
                <span
                    class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                    :class="chipTone(gasto.quienPago)"
                >
                  {{ personaLabel(gasto.quienPago) }}
                </span>
              </span>
              <select
                  v-else
                  v-model="gastoEnEdicion.quienPago"
                  class="rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:ring-2 focus:ring-navy-300 dark:border-navy-700 dark:bg-navy-800 dark:text-slate-100"
                  aria-label="Editar quién pagó"
              >
                <option v-for="p in filtrosDisponibles" :key="p" :value="p">{{ personaLabel(p) }}</option>
              </select>
            </td>

            <td class="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
              <span v-if="editandoId !== gasto.id">{{ gasto.fecha }}</span>
              <input
                  v-else
                  v-model="gastoEnEdicion.fecha"
                  type="date"
                  class="rounded border border-slate-300 bg-white px-2 py-1 outline-none focus:ring-2 focus:ring-navy-300 dark:border-navy-700 dark:bg-navy-800 dark:text-slate-100"
                  aria-label="Editar fecha"
              />
            </td>

            <td class="px-4 py-3 text-center">
              <template v-if="editandoId !== gasto.id">
                <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-navy-700 transition hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-800"
                    @click="emit('editar', gasto)"
                >
                  <SvgIcon name="edit" :size="13" aria-hidden="true" />
                  Editar
                </button>
                <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    @click="emit('eliminar', gasto.id)"
                >
                  <SvgIcon name="trash" :size="13" aria-hidden="true" />
                  Eliminar
                </button>
              </template>
              <template v-else>
                <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                    @click="emit('guardar', gasto.id)"
                >
                  <SvgIcon name="check" :size="13" aria-hidden="true" />
                  Guardar
                </button>
                <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-navy-800"
                    @click="emit('cancelar')"
                >
                  <SvgIcon name="close" :size="13" aria-hidden="true" />
                  Cancelar
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
</template>