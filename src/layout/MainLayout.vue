<template>
  <div class="min-h-screen bg-gray-50" @click="cerrarMenu">
    <!-- Navbar -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <!-- Logo + Saludo izquierda -->
        <div class="flex items-center gap-8">
          <div class="text-2xl font-bold">💰 Splitter</div>
          <div v-if="usuario" class="text-sm text-gray-600">
            Hola, <span class="font-semibold">{{ usuario.nombre }}</span>
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
  usuario: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['menu', 'logout'])
const menuAbierto = ref(false)

</script>