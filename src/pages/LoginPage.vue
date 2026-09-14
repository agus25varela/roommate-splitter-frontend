<script setup lang="ts">
/**
 * Página de login/signup.
 *
 * Usa el AuthLayout con el panel de marca y el formulario tipado; maneja
 * errores de la API y validación básica de entrada.
 */
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/layout/AuthLayout.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppAlert from '@/components/ui/AppAlert.vue'
import { useAuth } from '@/composables/useAuth'

type FormMode = 'login' | 'signup'

const router = useRouter()
const { login, signup, loading, error, cargarUsuario } = useAuth()

const modo = ref<FormMode>('login')

const loginForm = ref({
    email: '',
    password: '',
})

const signupForm = ref({
    email: '',
    nombre: '',
    password: '',
})

const fieldErrors = ref<Record<string, string>>({})

function validarLogin(): boolean {
    const errs: Record<string, string> = {}
    if (!loginForm.value.email.trim()) errs.email = 'Ingresá tu email'
    else if (!/^\S+@\S+\.\S+$/.test(loginForm.value.email)) errs.email = 'Email inválido'
    if (!loginForm.value.password) errs.password = 'Ingresá tu contraseña'
    fieldErrors.value = errs
    return Object.keys(errs).length === 0
}

function validarSignup(): boolean {
    const errs: Record<string, string> = {}
    if (!signupForm.value.email.trim()) errs.email = 'Ingresá tu email'
    else if (!/^\S+@\S+\.\S+$/.test(signupForm.value.email)) errs.email = 'Email inválido'
    if (!signupForm.value.nombre.trim()) errs.nombre = 'Ingresá tu nombre'
    else if (signupForm.value.nombre.trim().length < 2) errs.nombre = 'Mínimo 2 caracteres'
    if (!signupForm.value.password) errs.password = 'Ingresá una contraseña'
    else if (signupForm.value.password.length < 6) errs.password = 'Mínimo 6 caracteres'
    fieldErrors.value = errs
    return Object.keys(errs).length === 0
}

async function handleLogin(): Promise<void> {
    if (!validarLogin()) return
    try {
        await login(loginForm.value.email.trim(), loginForm.value.password)
        await router.push('/dashboard')
    } catch {
        // El error ya se expone en `error`.
    }
}

async function handleSignup(): Promise<void> {
    if (!validarSignup()) return
    try {
        await signup(
            signupForm.value.email.trim(),
            signupForm.value.nombre.trim(),
            signupForm.value.password,
        )
        await router.push('/dashboard')
    } catch {
        // El error ya se expone en `error`.
    }
}

function cambiarModo(next: FormMode): void {
    modo.value = next
    fieldErrors.value = {}
}

onMounted(() => {
    cargarUsuario()
})
</script>

<template>
  <AuthLayout>
    <template #title>
      {{ modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta' }}
    </template>
    <template #subtitle>
      {{
        modo === 'login'
            ? 'Tus gastos y el panel del proyecto te esperan.'
            : 'Unite a tu comunidad y dividí gastos en minutos.'
      }}
    </template>

    <AppAlert v-if="error" variant="danger" title="No pudimos completar la operación" class="mb-4">
      {{ error }}
    </AppAlert>

    <form v-if="modo === 'login'" class="space-y-4" novalidate @submit.prevent="handleLogin">
      <AppInput
          v-model="loginForm.email"
          label="Email"
          type="email"
          placeholder="tu@email.com"
          autocomplete="email"
          :error="fieldErrors.email"
          required
      />
      <AppInput
          v-model="loginForm.password"
          label="Contraseña"
          type="password"
          placeholder="Tu contraseña"
          autocomplete="current-password"
          :error="fieldErrors.password"
          required
      />
      <AppButton type="submit" block :loading="loading">
        Ingresar
      </AppButton>
      <p class="pt-2 text-center text-sm text-slate-500 dark:text-slate-400">
        ¿Todavía no tenés cuenta?
        <button
            type="button"
            class="font-semibold text-navy-700 hover:underline dark:text-navy-200"
            @click="cambiarModo('signup')"
        >
          Crear cuenta
        </button>
      </p>
    </form>

    <form v-else class="space-y-4" novalidate @submit.prevent="handleSignup">
      <AppInput
          v-model="signupForm.email"
          label="Email"
          type="email"
          placeholder="tu@email.com"
          autocomplete="email"
          :error="fieldErrors.email"
          required
      />
      <AppInput
          v-model="signupForm.nombre"
          label="Nombre"
          type="text"
          placeholder="Tu nombre"
          autocomplete="name"
          :error="fieldErrors.nombre"
          required
      />
      <AppInput
          v-model="signupForm.password"
          label="Contraseña"
          type="password"
          placeholder="Mínimo 6 caracteres"
          autocomplete="new-password"
          hint="Al menos 6 caracteres."
          :error="fieldErrors.password"
          required
      />
      <AppButton variant="success" type="submit" block :loading="loading">
        Registrarse
      </AppButton>
      <p class="pt-2 text-center text-sm text-slate-500 dark:text-slate-400">
        ¿Ya tenés cuenta?
        <button
            type="button"
            class="font-semibold text-navy-700 hover:underline dark:text-navy-200"
            @click="cambiarModo('login')"
        >
          Volver al inicio de sesión
        </button>
      </p>
    </form>
  </AuthLayout>
</template>