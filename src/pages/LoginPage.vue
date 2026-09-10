<template>
  <div v-if="!isAutenticado()" class="fixed inset-0 flex z-50">
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

          <!-- Mostrar errores -->
          <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {{ error }}
          </div>

          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                  v-model="loginForm.email"
                  type="email"
                  placeholder="tu@email.com"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="Tu contraseña"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <button
                :disabled="loading"
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition mt-6"
            >
              {{ loading ? 'Ingresando...' : 'Ingresar' }}
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

          <!-- Mostrar errores -->
          <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {{ error }}
          </div>

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

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                  v-model="signupForm.password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <button
                :disabled="loading"
                type="submit"
                class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition mt-6"
            >
              {{ loading ? 'Registrando...' : 'Registrarse' }}
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

  <!-- Si está autenticado, mostrar el dashboard -->
  <div v-else>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, signup, loading, error, isAutenticado, cargarUsuario } = useAuth()

const modo = ref<'login' | 'signup'>('login')

const loginForm = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  email: '',
  nombre: '',
  password: ''
})

// Cargar usuario desde localStorage al montar el componente
onMounted(() => {
  cargarUsuario()
})

const handleLogin = async () => {
  if (!loginForm.value.email || !loginForm.value.password) {
    return
  }

  try {
    await login(loginForm.value.email, loginForm.value.password)
    // Si login es exitoso, redirigir a dashboard
    router.push('/dashboard')
  } catch (err) {
    // El error ya está en `error.value`, se muestra en el template
  }
}

const handleSignup = async () => {
  if (!signupForm.value.email || !signupForm.value.nombre || !signupForm.value.password) {
    return
  }

  try {
    await signup(signupForm.value.email, signupForm.value.nombre, signupForm.value.password)
    // Si signup es exitoso, redirigir a dashboard
    router.push('/dashboard')
  } catch (err) {
    // El error ya está en `error.value`, se muestra en el template
  }
}
</script>