<script setup lang="ts">
/**
 * Layout de autenticación.
 *
 * Pantalla partida: panel de marca a la izquierda (desktop) y contenido del
 * formulario a la derecha (slots: `title`, `subtitle`, `form`).
 */
import SvgIcon from '@/components/ui/SvgIcon.vue'
</script>

<template>
  <div class="flex min-h-screen bg-slate-100 dark:bg-navy-950">
    <aside
        class="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 p-12 text-white lg:flex"
    >
      <div class="flex items-center gap-3">
        <SvgIcon name="logo" :size="32" class="text-white" aria-hidden="true" />
        <span class="text-xl font-bold">Roommate Splitter</span>
      </div>

      <div>
        <h2 class="max-w-md text-3xl font-bold leading-tight">
          Divide gastos y controlá el proyecto desde un solo lugar.
        </h2>
        <p class="mt-4 max-w-md text-sm text-navy-200">
          Gestioná los gastos con tu comunidad y, además, mirá el estado del
          desarrollo: tareas, métricas de código y logs de despliegue.
        </p>
      </div>

      <ul class="space-y-3 text-sm text-navy-200">
        <li class="flex items-center gap-3">
          <SvgIcon name="check-circle" :size="18" class="text-emerald-400" aria-hidden="true" />
          Gastos compartidos y balances automáticos
        </li>
        <li class="flex items-center gap-3">
          <SvgIcon name="check-circle" :size="18" class="text-emerald-400" aria-hidden="true" />
          Panel del proyecto con métricas en vivo
        </li>
        <li class="flex items-center gap-3">
          <SvgIcon name="check-circle" :size="18" class="text-emerald-400" aria-hidden="true" />
          Modo oscuro, responsive y accesible
        </li>
      </ul>
    </aside>

    <div class="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
      <main class="w-full max-w-md">
        <div class="mb-8 flex items-center gap-2 lg:hidden">
          <SvgIcon name="logo" :size="28" class="text-navy-700 dark:text-navy-200" aria-hidden="true" />
          <span class="text-lg font-bold text-slate-900 dark:text-white">Roommate Splitter</span>
        </div>

        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
          <slot name="title" />
        </h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
          <slot name="subtitle" />
        </p>

        <div class="mt-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>