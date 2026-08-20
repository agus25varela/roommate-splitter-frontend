<template>
  <div class="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
    <h2 class="text-2xl font-bold text-slate-800 mb-6">Agregar Gasto</h2>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
        <input
            v-model="descripcion"
            type="text"
            placeholder="Ej: Luz, Internet, Comida"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Monto ($)</label>
        <input
            v-model.number="monto"
            type="number"
            placeholder="0.00"
            step="0.01"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">¿Quién pagó?</label>
        <select
            v-model="quienPago"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
        >
          <option value="">Selecciona quién pagó</option>
          <option value="yo">Yo</option>
          <option value="roommate_a">Roommate A</option>
          <option value="roommate_b">Roommate B</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700 mb-2">Fecha</label>
        <input
            v-model="fecha"
            type="date"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      <button
          @click="handleAgregar"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
      >
        ✓ Agregar Gasto
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['crear'])

const descripcion = ref('')
const monto = ref('')
const quienPago = ref('')
const fecha = ref('')

const handleAgregar = () => {
  if (!descripcion.value || !monto.value || !quienPago.value || !fecha.value) {
    alert('Por favor completa todos los campos')
    return
  }

  emit('crear', {
    descripcion: descripcion.value,
    monto: parseFloat(monto.value),
    quienPago: quienPago.value,
    fecha: fecha.value
  })

  // Limpiar
  descripcion.value = ''
  monto.value = ''
  quienPago.value = ''
  fecha.value = ''
}
</script>