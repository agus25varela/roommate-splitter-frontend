<template>
  <div v-if="usuario">
    <MainLayout :usuario="usuario" @menu="handleMenu" @logout="handleLogout">
      <div class="p-6">
        <h1 class="text-3xl font-bold mb-6">Dashboard</h1>

        <div class="grid grid-cols-12 gap-6">
          <div class="col-span-8">
            <FormGasto @crear="cargarGastos" />
            <TablaGasto
                :gastos="gastosData"
                :editandoId="editandoId"
                :gastoEnEdicion="gastoEnEdicion"
                @editar="manejarEditar"
                @guardar="manejarGuardar"
                @cancelar="manejarCancelar"
                @eliminar="manejarEliminar"
            />
          </div>

          <div class="col-span-4">
            <ResumenDeuda :deuda="deuda" />
            <DashboardCharts :gasto="gastosData" />
          </div>
        </div>
      </div>
    </MainLayout>
  </div>
  <div v-else class="flex items-center justify-center h-screen">
    <p class="text-gray-600">Cargando...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'
import FormGasto from '@/components/features/FormGasto.vue'
import TablaGasto from '@/components/features/TablaGasto.vue'
import ResumenDeuda from '@/components/features/ResumenDeuda.vue'
import DashboardCharts from '@/components/features/DashboardCharts.vue'
import { useGastos } from '@/composables/useGastos'
import { useAuth } from '@/composables/useAuth'
import {Gasto} from "@/types";

const router = useRouter()
const { usuario, logout, cargarUsuario } = useAuth()
const menuActivo = ref('dashboard')

// Variable para almacenar el composable
let gastosComposable: ReturnType<typeof useGastos> | null = null

// Cargar usuario desde localStorage
onMounted(() => {
  cargarUsuario()

  // Si no hay usuario autenticado, redirigir a login
  if (!usuario.value) {
    router.push('/login')
    return
  }

  // Inicializar useGastos con el usuarioId del usuario autenticado
  gastosComposable = useGastos(String(usuario.value.id))

  // Cargar gastos
  gastosComposable.cargarGastos()
})

// Valores reactivos
const gastosData = computed(() => {
  return gastosComposable?.gastos?.value || []
})

const deuda = computed(() => {
  return gastosComposable?.deudas?.value || []
})

const cargarGastos = async (gasto: Omit<Gasto, 'id'>) => {
  if (gastosComposable) {
    await gastosComposable.crearGasto(gasto)
  }
}

const editandoId = ref<string | null>(null)
const gastoEnEdicion = ref<Partial<Gasto>>({})

const manejarEditar = (gasto: Gasto) => {
  editandoId.value = gasto.id
  gastoEnEdicion.value = { ...gasto }
}

const manejarGuardar = async (id: string) => {
  if (gastosComposable) {
    await gastosComposable.actualizarGasto(id, gastoEnEdicion.value)
    editandoId.value = null
    gastoEnEdicion.value = {}
  }
}

const manejarCancelar = () => {
  editandoId.value = null
  gastoEnEdicion.value = {}
}

const manejarEliminar = async (id: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
    if (gastosComposable) {
      await gastosComposable.eliminarGasto(id)
    }
  }
}

const handleMenu = (menu: string) => {
  menuActivo.value = menu
  console.log('Navegando a:', menu)
}

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>