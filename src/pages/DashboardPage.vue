<script setup lang="ts">
/**
 * Vista principal de Gastos.
 *
 * Integra el alta de gastos, la tabla con CRUD en línea, el resumen de deudas
 * y los gráficos, usando el nuevo layout y design system.
 */
import { computed, onMounted, ref, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'
import FormGasto from '@/components/features/FormGasto.vue'
import TablaGasto from '@/components/features/TablaGasto.vue'
import ResumenDeuda from '@/components/features/ResumenDeuda.vue'
import DashboardCharts from '@/components/features/DashboardCharts.vue'
import AppAlert from '@/components/ui/AppAlert.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import { useGastos } from '@/composables/useGastos'
import type { UseGastosReturn } from '@/composables/useGastos'
import { useAuth } from '@/composables/useAuth'
import type { BalanceDTO, CreateGastoDTO, Gasto } from '@/types'

const router = useRouter()
const { usuario, cargarUsuario } = useAuth()

const api = shallowRef<UseGastosReturn | null>(null)
const error = ref<string | null>(null)

const gastosList = computed<Gasto[]>(() => api.value?.gastos.value ?? [])
const deudaList = computed<BalanceDTO[]>(() => api.value?.deudas.value ?? [])
const cargando = computed<boolean>(() => api.value?.loading.value ?? false)
const backendError = computed<string | null>(() => api.value?.error.value ?? null)
const showError = computed<string | null>(() => error.value ?? backendError.value)

const editandoId = ref<number | null>(null)
const gastoEnEdicion = ref<Partial<Gasto>>({})

async function cargar(): Promise<void> {
    const g = api.value
    if (!g) return
    await g.cargarGastos()
    error.value = g.error.value
}

onMounted(async () => {
    cargarUsuario()
    if (!usuario.value) {
        await router.push('/login')
        return
    }
    api.value = useGastos(usuario.value.id)
    await cargar()
})

async function crear(gasto: Omit<CreateGastoDTO, 'usuarioId'>): Promise<void> {
    const g = api.value
    if (!g || !usuario.value) return
    try {
        await g.crearGasto({ ...gasto, usuarioId: usuario.value.id })
        error.value = null
    } catch {
        error.value = 'No se pudo crear el gasto.'
    }
}

function manejarEditar(gasto: Gasto): void {
    editandoId.value = gasto.id
    gastoEnEdicion.value = { ...gasto }
}

async function manejarGuardar(id: number): Promise<void> {
    const g = api.value
    if (!g) return
    try {
        await g.actualizarGasto(id, gastoEnEdicion.value)
        editandoId.value = null
        gastoEnEdicion.value = {}
        error.value = null
    } catch {
        error.value = 'No se pudo guardar el gasto.'
    }
}

function manejarCancelar(): void {
    editandoId.value = null
    gastoEnEdicion.value = {}
}

async function manejarEliminar(id: number): Promise<void> {
    if (!window.confirm('¿Estás seguro de que querés eliminar este gasto?')) return
    const g = api.value
    if (!g) return
    try {
        await g.eliminarGasto(id)
        error.value = null
    } catch {
        error.value = 'No se pudo eliminar el gasto.'
    }
}
</script>

<template>
  <MainLayout>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Gastos</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Registrá, editá y eliminá los gastos compartidos.
      </p>
    </div>

    <AppAlert
        v-if="showError"
        variant="danger"
        title="Hubo un problema con el backend"
        dismissible
        class="mt-4"
        @dismiss="error = null"
    >
      {{ showError }} Revisá que el backend esté corriendo.
      <button type="button" class="ml-1 font-semibold underline underline-offset-2" @click="cargar">
        Reintentar
      </button>
    </AppAlert>

    <div v-if="cargando && gastosList.length === 0" class="mt-12 flex items-center justify-center py-16">
      <AppSpinner :size="28" label="Cargando gastos" />
    </div>

    <template v-else>
      <div class="mt-6">
        <FormGasto @crear="crear" />
      </div>

      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <TablaGasto
              :gastos="gastosList"
              :editando-id="editandoId"
              :gasto-en-edicion="gastoEnEdicion"
              @editar="manejarEditar"
              @guardar="manejarGuardar"
              @cancelar="manejarCancelar"
              @eliminar="manejarEliminar"
          />
        </div>
        <div>
          <ResumenDeuda :deuda="deudaList" />
        </div>
      </div>

      <div class="mt-6">
        <DashboardCharts :gasto="gastosList" />
      </div>
    </template>
  </MainLayout>
</template>