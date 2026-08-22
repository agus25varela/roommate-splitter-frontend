<template>
  <div v-if="!isLoggedIn" class="fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-2xl p-8 w-96">
      <h2 class="text-3xl font-bold text-center mb-2">💰 Roommate Splitter</h2>
      <p class="text-center text-slate-600 mb-8">Divide gastos con tu comunidad</p>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <input
            v-model="nombre"
            type="text"
            placeholder="Tu nombre"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
          Ingresar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])
const nombre = ref('')
const email = ref('')
const isLoggedIn = ref(false)

const handleLogin = () => {
  if (!nombre.value || !email.value) {
    alert('Completa todos los campos')
    return
  }
  emit('login', { nombre: nombre.value, email: email.value })
  isLoggedIn.value = true
}
</script>