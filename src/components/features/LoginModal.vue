<template>
  <div v-if="!isLoggedIn" class="fixed inset-0 flex z-50">
    <!-- Columna izquierda: Imagen -->
    <div class="hidden lg:flex w-1/2 bg-cover bg-center" :style="{ backgroundImage: 'url(/login-bg.jpg)' }">
      <!-- La imagen se carga como background -->
    </div>

    <!-- Columna derecha: Formulario -->
    <div class="w-full lg:w-1/2 bg-white flex items-center justify-center p-6">
      <div class="w-full max-w-md">
        <!-- Modo LOGIN -->
        <template v-if="modo === 'login'">
        <h2 class="text-4xl font-bold mb-2">Roommate Splitter</h2>
        <p class="text-gray-600 mb-8">Divide gastos con tu comunidad</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
            <input
                v-model="loginForm.nombre"
                type="text"
                placeholder="Tu nombre"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
                v-model="loginForm.email"
                type="email"
                placeholder="tu@email.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition mt-6"
          >
            Ingresar
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600 mb-4">¿No tenes cuenta?</p>
          <button
              @click="modo = 'signup'"
              class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
          >
            Crear Cuenta
          </button>
        </div>
</template>

<!-- Modo SIGNUP -->
<template v-else-if="modo === 'signup'">
  <h2 class="text-3xl font-bold mb-2">Crear Cuenta</h2>
  <p class="text-gray-600 mb-8">Únete a Roommate Splitter</p>

  <form @submit.prevent="handleSignup" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
      <input
          v-model="signupForm.email"
          type="email"
          placeholder="tu@email.com"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
      <input
          v-model="signupForm.nombre"
          type="text"
          placeholder="Tu nombre"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
    </div>

    <button
        type="submit"
        class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition mt-6"
    >
      Registrarse
    </button>
  </form>

  <div class="mt-8 text-center">
    <button
        @click="modo = 'login'"
        class="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
    >
      ← Volver al Login
    </button>
  </div>
</template>
</div>
</div>
</div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])

const modo = ref('login') // 'login' o 'signup'
const isLoggedIn = ref(false)

const loginForm = ref({
  nombre: '',
  email: ''
})

const signupForm = ref({
  email: '',
  nombre: ''
})

const handleLogin = () => {
  if (!loginForm.value.nombre || !loginForm.value.email) {
    alert('Completa todos los campos')
    return
  }
  emit('login', { nombre: loginForm.value.nombre, email: loginForm.value.email })
  isLoggedIn.value = true
}

const handleSignup = () => {
  if (!signupForm.value.email || !signupForm.value.nombre) {
    alert('Completa todos los campos')
    return
  }
  // Después del signup, emitimos login automáticamente
  emit('login', { nombre: signupForm.value.nombre, email: signupForm.value.email })
  isLoggedIn.value = true
}
</script>