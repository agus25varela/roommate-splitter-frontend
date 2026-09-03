<template>
  <MainLayout>
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-8">
        <FormGasto @gasto-creado="cargarGastos" />
        <TablaGasto :gastos="gastos" />
      </div>
      <div class="col-span-4">
        <ResumenDeuda :deudas="deudas" />
        <DashboardCharts :gastos="gastos" />
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import MainLayout from '@/layout/MainLayout.vue'
import FormGasto from '@/components/features/FormGasto.vue'
import TablaGasto from '@/components/features/TablaGasto.vue'
import ResumenDeuda from '@/components/features/ResumenDeuda.vue'
import DashboardCharts from '@/components/features/DashboardCharts.vue'
import { useGastos } from '@/composables/useGastos'

const usuarioId = 'usuario-id-aqui' // Esto debe venir del auth en producción
const { gastos, deudas, loading, error, cargarGastos } = useGastos(usuarioId)

onMounted(() => cargarGastos())
</script>