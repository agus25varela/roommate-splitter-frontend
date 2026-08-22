<template>
  <LoginModal v-if="!usuarioLogueado" @login="handleLogin" />

  <Sidebar v-else :usuario="usuario" @menu="pagActual = $event" @logout="handleLogout">
    <!-- Dashboard -->
    <div v-if="pagActual === 'dashboard'" class="space-y-8">
      <div>
        <h1 class="text-4xl font-bold mb-2">Dashboard</h1>
        <p class="text-slate-600">Resumen de tus gastos compartidos</p>
      </div>
      <DashboardCharts :gastos="gastos" />
    </div>

    <!-- Gastos -->
    <div v-else-if="pagActual === 'gastos'" class="space-y-8">
      <h1 class="text-4xl font-bold">Mis Gastos</h1>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <FormGasto @crear="crearGasto" />
        <div class="lg:col-span-2">
          <TablaGastos
              :gastos="gastos"
              :editandoId="editandoId"
              :gastoEnEdicion="gastoEnEdicion"
              @editar="iniciarEdicion"
              @guardar="guardarEdicion"
              @cancelar="cancelarEdicion"
              @eliminar="eliminarGasto"
          />
        </div>
      </div>
    </div>

    <!-- Balance -->
    <div v-else-if="pagActual === 'balance'" class="space-y-8">
      <h1 class="text-4xl font-bold">Balances</h1>
      <ResumenDeudas :balances="balances" />
    </div>
  </Sidebar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import LoginModal from './components/LoginModal.vue'
import Sidebar from './components/Sidebar.vue'
import FormGasto from './components/FormGasto.vue'
import TablaGastos from './components/TablaGastos.vue'
import ResumenDeudas from './components/ResumenDeudas.vue'
import DashboardCharts from './components/DashboardCharts.vue'

const usuarioLogueado = ref(false)
const usuario = ref({})
const pagActual = ref('dashboard')
const gastos = ref([])
const balances = ref([])
const editandoId = ref(null)
const gastoEnEdicion = ref({})

const API_URL = `${import.meta.env.VITE_API_URL}/gastos`

const handleLogin = async (usuarioData) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL.replace('/api', '')}/api/usuarios/login`, usuarioData)
    usuario.value = response.data
    usuarioLogueado.value = true
    localStorage.setItem('usuario', JSON.stringify(usuario.value))
    cargarGastos()
    cargarBalances()
  } catch (error) {
    console.error('Error login:', error)
    alert('Error en login')
  }
}

const handleLogout = () => {
  usuarioLogueado.value = false
  usuario.value = {}
  gastos.value = []
  balances.value = []
  localStorage.removeItem('usuario')
}

onMounted(() => {
  const usuarioGuardado = localStorage.getItem('usuario')
  if (usuarioGuardado) {
    usuario.value = JSON.parse(usuarioGuardado)
    usuarioLogueado.value = true
    cargarGastos()
    cargarBalances()
  }
})

const cargarGastos = async () => {
  try {
    const response = await axios.get(API_URL, {
      params: { usuarioId: usuario.value.id }
    })
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
    const gastoParaEnviar = {
      ...nuevoGasto,
      usuarioId: usuario.value.id
    }
    await axios.post(API_URL, gastoParaEnviar)
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