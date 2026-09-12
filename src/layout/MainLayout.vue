<template>
  <div class="min-h-screen bg-gray-50" @click="cerrarMenu">
    <!-- Navbar Principal -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <!-- Logo + Saludo izquierda -->
        <div class="flex items-center gap-8">
          <div class="text-2xl font-bold">💰 Splitter</div>
          <div v-if="usuario" class="text-sm text-gray-600">
            Hola, <span class="font-semibold">{{ usuario.nombre }}</span>
          </div>
        </div>

        <!-- Logout -->
        <button
            @click="$emit('logout')"
            class="text-sm font-medium text-red-600 hover:text-red-800 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>

    <!-- Navbar de Secciones -->
    <div class="bg-white border-b border-slate-200 sticky top-16 z-40">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex gap-8">
          <button
              @click="$emit('menu', 'dashboard')"
              :class="[
                'py-4 px-2 font-medium transition border-b-2',
                menuActivo === 'dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              ]"
          >
            📊 Dashboard
          </button>
          <button
              @click="$emit('menu', 'balances')"
              :class="[
                'py-4 px-2 font-medium transition border-b-2',
                menuActivo === 'balances'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              ]"
          >
            ⚖️ Balances
          </button>
          <button
              @click="$emit('menu', 'reportes')"
              :class="[
                'py-4 px-2 font-medium transition border-b-2',
                menuActivo === 'reportes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-800'
              ]"
          >
            📈 Reportes
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
  usuario: {
    type: Object,
    default: null
  },
  menuActivo: {
    type: String,
    default: 'dashboard'
  }
})

const emit = defineEmits(['menu', 'logout'])
</script>