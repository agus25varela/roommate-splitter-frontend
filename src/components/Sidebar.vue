<template>
  <div class="min-h-screen bg-gray-50" @click="cerrarMenu">
    <!-- Navbar -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <!-- Logo + Saludo izquierda -->
        <div class="flex items-center gap-8">
          <div class="text-2xl font-bold">💰 Splitter</div>
          <div class="text-sm text-gray-600">
            Hola, <span class="font-semibold">{{ usuario.nombre }}</span>
          </div>
        </div>

        <!-- Menú de navegación centro -->
        <div class="flex items-center gap-1">
          <button
              @click="$emit('menu', 'dashboard')"
              class="px-4 py-2 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
          >
            📊 Dashboard
          </button>
          <button
              @click="$emit('menu', 'gastos')"
              class="px-4 py-2 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
          >
            💸 Mis Gastos
          </button>
          <button
              @click="$emit('menu', 'balance')"
              class="px-4 py-2 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
          >
            ⚖️ Balances
          </button>
          <button
              @click="$emit('menu', 'reportes')"
              class="px-4 py-2 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
          >
            📈 Reportes
          </button>
        </div>

        <!-- Menú desplegable derecha -->
        <div class="relative" @click.stop>
          <button
              @click="menuAbierto = !menuAbierto"
              class="px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            📌 Más
          </button>
          <div
              v-if="menuAbierto"
              class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <button
                @click="handleAyuda"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-sm"
            >
              ❔ Ayuda
            </button>
            <button
                @click="handleConfiguracion"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-sm"
            >
              ⚙️ Configuración
            </button>
            <div class="border-t border-gray-200"></div>
            <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 transition text-sm font-semibold"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  usuario: Object
})

const emit = defineEmits(['menu', 'logout'])
const menuAbierto = ref(false)

const cerrarMenu = () => {
  menuAbierto.value = false
}

const handleAyuda = () => {
  alert('Ayuda: Divide tus gastos de forma justa entre compañeros.')
  menuAbierto.value = false
}

const handleConfiguracion = () => {
  alert('Configuración: Próximamente')
  menuAbierto.value = false
}

const handleLogout = () => {
  menuAbierto.value = false
  emit('logout')
}
</script>