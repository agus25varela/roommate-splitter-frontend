<template>
  <div style="padding: 20px; font-family: Arial, sans-serif;">
    <h1>Roommate Splitter</h1>

    <!-- Formulario para agregar gasto -->
    <div style="margin-bottom: 30px; border: 1px solid #ccc; padding: 15px; border-radius: 5px;">
      <h2>Agregar Gasto</h2>
      <input
          v-model="nuevoGasto.descripcion"
          placeholder="Descripción"
          style="display: block; margin-bottom: 10px; padding: 8px; width: 100%;"
      />
      <input
          v-model.number="nuevoGasto.monto"
          type="number"
          placeholder="Monto"
          style="display: block; margin-bottom: 10px; padding: 8px; width: 100%;"
      />
      <select
          v-model="nuevoGasto.quienPago"
          style="display: block; margin-bottom: 10px; padding: 8px; width: 100%;"
      >
        <option value="">Selecciona quién pagó</option>
        <option value="yo">Yo</option>
        <option value="roommate_a">Roommate A</option>
        <option value="roommate_b">Roommate B</option>
      </select>
      <input
          v-model="nuevoGasto.fecha"
          type="date"
          style="display: block; margin-bottom: 10px; padding: 8px; width: 100%;"
      />
      <button
          @click="crearGasto"
          style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; cursor: pointer; border-radius: 3px;"
      >
        Agregar
      </button>
    </div>

    <!-- Tabla de gastos -->
    <div>
      <h2>Gastos</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="border: 1px solid #ddd; padding: 8px;">ID</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Descripción</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Monto</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Quién Pagó</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Fecha</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="gasto in gastos" :key="gasto.id" style="border: 1px solid #ddd;">
          <td style="border: 1px solid #ddd; padding: 8px;">{{ gasto.id }}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">
            <span v-if="editandoId !== gasto.id">{{ gasto.descripcion }}</span>
            <input
                v-else
                v-model="gastoEnEdicion.descripcion"
                style="padding: 5px; width: 95%;"
            />
          </td>
          <td style="border: 1px solid #ddd; padding: 8px;">
            <span v-if="editandoId !== gasto.id">${{ gasto.monto }}</span>
            <input
                v-else
                v-model.number="gastoEnEdicion.monto"
                type="number"
                style="padding: 5px; width: 95%;"
            />
          </td>
          <td style="border: 1px solid #ddd; padding: 8px;">
            <span v-if="editandoId !== gasto.id">{{ gasto.quienPago }}</span>
            <select
                v-else
                v-model="gastoEnEdicion.quienPago"
                style="padding: 5px; width: 100%;"
            >
              <option value="yo">Yo</option>
              <option value="roommate_a">Roommate A</option>
              <option value="roommate_b">Roommate B</option>
            </select>
          </td>
          <td style="border: 1px solid #ddd; padding: 8px;">
            <span v-if="editandoId !== gasto.id">{{ gasto.fecha }}</span>
            <input
                v-else
                v-model="gastoEnEdicion.fecha"
                type="date"
                style="padding: 5px; width: 95%;"
            />
          </td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
            <template v-if="editandoId !== gasto.id">
              <button
                  @click="iniciarEdicion(gasto)"
                  style="padding: 5px 10px; background-color: #2196F3; color: white; border: none; cursor: pointer; margin-right: 5px;"
              >
                Editar
              </button>
              <button
                  @click="eliminarGasto(gasto.id)"
                  style="padding: 5px 10px; background-color: #f44336; color: white; border: none; cursor: pointer;"
              >
                Eliminar
              </button>
            </template>
            <template v-else>
              <button
                  @click="guardarEdicion(gasto.id)"
                  style="padding: 5px 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer; margin-right: 5px;"
              >
                Guardar
              </button>
              <button
                  @click="cancelarEdicion"
                  style="padding: 5px 10px; background-color: #999; color: white; border: none; cursor: pointer;"
              >
                Cancelar
              </button>
            </template>
          </td>
        </tr>
        </tbody>
      </table>
      <p v-if="gastos.length === 0" style="color: #999; margin-top: 20px;">No hay gastos aún.</p>
    </div>

    <!-- Resumen de deudas -->
    <div style="margin-top: 30px; border: 1px solid #ff9800; padding: 15px; border-radius: 5px; background-color: #fff3e0;">
      <h2 style="color: #ff9800;">Resumen de Deudas</h2>
      <div v-if="balances.length === 0" style="color: #999;">
        Todos pagaron el mismo monto.
      </div>
      <div v-else>
        <p v-for="balance in balances" :key="`${balance.from}-${balance.to}`" style="margin: 10px 0; font-size: 16px;">
          <strong>{{ balance.from }}</strong> le debe <strong>${{ balance.amount.toFixed(2) }}</strong> a <strong>{{ balance.to }}</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'App',
  setup() {
    const gastos = ref([])
    const balances = ref([])
    const editandoId = ref(null)
    const gastoEnEdicion = ref({})
    const nuevoGasto = ref({
      descripcion: '',
      monto: '',
      quienPago: '',
      fecha: ''
    })

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

    const crearGasto = async () => {
      if (!nuevoGasto.value.descripcion || !nuevoGasto.value.monto || !nuevoGasto.value.quienPago || !nuevoGasto.value.fecha) {
        alert('Por favor completa todos los campos')
        return
      }

      try {
        await axios.post(API_URL, nuevoGasto.value)
        nuevoGasto.value = {
          descripcion: '',
          monto: '',
          quienPago: '',
          fecha: ''
        }
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
        alert('Error al editar el gasto')
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
          alert('Error al eliminar el gasto')
        }
      }
    }

    return {
      gastos,
      balances,
      nuevoGasto,
      editandoId,
      gastoEnEdicion,
      crearGasto,
      iniciarEdicion,
      guardarEdicion,
      cancelarEdicion,
      eliminarGasto
    }
  }
}
</script>

<style scoped>
</style>