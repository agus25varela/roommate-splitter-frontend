<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-white mb-2">💰 Roommate Splitter</h1>
        <p class="text-slate-400 text-lg">Divide gastos de forma justa y transparente</p>
      </div>

      <!-- Grid responsivo -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Formulario (sidebar en desktop, full en móvil) -->
        <div class="lg:col-span-1">
          <FormGasto @crear="crearGasto" />
        </div>

        <!-- Contenido principal -->
        <div class="lg:col-span-2 space-y-8">
          <TablaGastos
              :gastos="gastos"
              :editandoId="editandoId"
              :gastoEnEdicion="gastoEnEdicion"
              @editar="iniciarEdicion"
              @guardar="guardarEdicion"
              @cancelar="cancelarEdicion"
              @eliminar="eliminarGasto"
          />

          <ResumenDeudas :balances="balances" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import FormGasto from './components/FormGasto.vue'
import TablaGastos from './components/TablaGastos.vue'
import ResumenDeudas from './components/ResumenDeudas.vue'

const gastos = ref([])
const balances = ref([])
const editandoId = ref(null)
const gastoEnEdicion = ref({})

const API_URL = `${import.meta.env.VITE_API_URL}/gastos`

onMounted(() => {
  cargarGastos()
  cargarBalances()
})

const cargarGastos = async () => {
  try {
    const response = await axios.get(API_URL)
    gastos.value = response.data
  } catch (error) {
    console.error('Error cargando gastos:', error)
  }
}

const cargarBalances = async () => {
  try {
    const response = await axios.get(`${API_URL}/balances`)
    balances.value = response.data
  } catch (error) {
    console.error('Error cargando balances:', error)
  }
}

const crearGasto = async (nuevoGasto) => {
  try {
    console.log('Enviando gasto:', nuevoGasto)
    await axios.post(API_URL, nuevoGasto)
    cargarGastos()
    cargarBalances()
  } catch (error) {
    console.error('Error creando gasto:', error)
    alert('Error al crear el gasto')
  }
}

const iniciarEdicion = (gasto) => {
  editandoId.value = gasto.id
  gastoEnEdicion.value = { ...gasto }
}

const guardarEdicion = async (id) => {
  try {
    await axios.put(`${API_URL}/${id}`, gastoEnEdicion.value)
    editandoId.value = null
    gastoEnEdicion.value = {}
    cargarGastos()
    cargarBalances()
  } catch (error) {
    console.error('Error editando gasto:', error)
  }
}

const cancelarEdicion = () => {
  editandoId.value = null
  gastoEnEdicion.value = {}
}

const eliminarGasto = async (id) => {
  if (confirm('¿Estás seguro de que querés eliminar este gasto?')) {
    try {
      await axios.delete(`${API_URL}/${id}`)
      cargarGastos()
      cargarBalances()
    } catch (error) {
      console.error('Error eliminando gasto:', error)
    }
  }
}
</script>