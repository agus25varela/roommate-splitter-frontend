<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-slate-200">
      <h2 class="text-2xl font-bold text-slate-800">Gastos</h2>
    </div>

    <div v-if="gastos.length === 0" class="p-6 text-center text-slate-500">
      No hay gastos registrados aún.
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-slate-100 border-b border-slate-200">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">ID</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Descripción</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Monto</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Quién Pagó</th>
          <th class="px-6 py-3 text-left text-sm font-semibold text-slate-700">Fecha</th>
          <th class="px-6 py-3 text-center text-sm font-semibold text-slate-700">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(gasto, idx) in gastos"
            :key="gasto.id"
            :class="[
              'border-b border-slate-200 transition',
              idx % 2 === 0 ? 'bg-slate-50' : 'bg-white',
              'hover:bg-blue-50'
            ]"
        >
          <td class="px-6 py-4 text-sm font-medium text-slate-800">{{ gasto.id }}</td>

          <td class="px-6 py-4 text-sm text-slate-700">
            <span v-if="editandoId !== gasto.id">{{ gasto.descripcion }}</span>
            <input
                v-else
                v-model="gastoEnEdicion.descripcion"
                type="text"
                class="w-full px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </td>

          <td class="px-6 py-4 text-sm text-slate-700 font-semibold">
            <span v-if="editandoId !== gasto.id">${{ gasto.monto.toFixed(2) }}</span>
            <input
                v-else
                v-model.number="gastoEnEdicion.monto"
                type="number"
                class="w-full px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </td>

          <td class="px-6 py-4 text-sm text-slate-700">
              <span v-if="editandoId !== gasto.id" class="px-3 py-1 bg-slate-200 rounded-full text-xs font-medium">
                {{ gasto.quienPago }}
              </span>
            <select
                v-else
                v-model="gastoEnEdicion.quienPago"
                class="w-full px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="yo">Yo</option>
              <option value="roommate_a">Roommate A</option>
              <option value="roommate_b">Roommate B</option>
            </select>
          </td>

          <td class="px-6 py-4 text-sm text-slate-700">
            <span v-if="editandoId !== gasto.id">{{ gasto.fecha }}</span>
            <input
                v-else
                v-model="gastoEnEdicion.fecha"
                type="date"
                class="w-full px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </td>

          <td class="px-6 py-4 text-sm text-center">
            <template v-if="editandoId !== gasto.id">
              <button
                  @click="$emit('editar', gasto)"
                  class="inline-flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition mr-2"
              >
                ✎ Editar
              </button>
              <button
                  @click="$emit('eliminar', gasto.id)"
                  class="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition"
              >
                ✕ Eliminar
              </button>
            </template>
            <template v-else>
              <button
                  @click="$emit('guardar', gasto.id)"
                  class="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-semibold transition mr-2"
              >
                ✓ Guardar
              </button>
              <button
                  @click="$emit('cancelar')"
                  class="inline-flex items-center gap-1 bg-slate-400 hover:bg-slate-500 text-white px-3 py-1 rounded-lg text-xs font-semibold transition"
              >
                ✗ Cancelar
              </button>
            </template>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  gastos: Array,
  editandoId: Number,
  gastoEnEdicion: Object
})

defineEmits(['editar', 'guardar', 'cancelar', 'eliminar'])
</script>