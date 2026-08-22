<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- Navbar mobile -->
      <div class="navbar bg-base-100 shadow-md lg:hidden">
        <label for="my-drawer-2" class="btn btn-ghost drawer-button">
          ☰
        </label>
        <h1 class="text-xl font-bold">Roommate Splitter</h1>
      </div>

      <!-- Contenido principal -->
      <div class="flex-1 p-6">
        <slot></slot>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="drawer-side">
      <label for="my-drawer-2" class="drawer-overlay"></label>
      <div class="menu p-6 w-80 bg-base-200 text-base-content min-h-screen">
        <div class="mb-8">
          <h2 class="text-2xl font-bold mb-2">💰 Splitter</h2>
          <p class="text-sm text-slate-600">Hola, {{ usuario.nombre }}</p>
        </div>

        <ul class="space-y-2">
          <li>
            <a href="#" class="btn btn-ghost justify-start" @click="$emit('menu', 'dashboard')">
              📊 Dashboard
            </a>
          </li>
          <li>
            <a href="#" class="btn btn-ghost justify-start" @click="$emit('menu', 'gastos')">
              💸 Mis Gastos
            </a>
          </li>
          <li>
            <a href="#" class="btn btn-ghost justify-start" @click="$emit('menu', 'balance')">
              ⚖️ Balances
            </a>
          </li>
          <li>
            <a href="#" class="btn btn-ghost justify-start" @click="$emit('menu', 'reportes')">
              📈 Reportes
            </a>
          </li>
        </ul>

        <div class="divider"></div>

        <button @click="$emit('logout')" class="btn btn-outline btn-error w-full">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  usuario: Object
})

defineEmits(['menu', 'logout'])
</script>