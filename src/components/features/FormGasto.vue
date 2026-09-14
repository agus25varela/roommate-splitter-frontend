<script setup lang="ts">
/**
 * Formulario para agregar un gasto (nueva UI del design system).
 *
 * Emite `CreateGastoDTO` tipado tras validar los campos.
 */
import { onMounted, ref } from 'vue'
import Card from '@/components/ui/Card.vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import AppButton from '@/components/ui/AppButton.vue'
import SvgIcon from '@/components/ui/SvgIcon.vue'
import {
    QUIEN_PAGO_OPCIONES,
    QUIEN_PAGO_LABEL,
    type CreateGastoDTO,
    type QuienPago,
} from '@/types/gasto'

const emit = defineEmits<{
    (e: 'crear', gasto: Omit<CreateGastoDTO, 'usuarioId'>): void
}>()

const descripcion = ref('')
const monto = ref('')
const quienPago = ref<string>('')
const fecha = ref('')

const fieldErrors = ref<Record<string, string>>({})

const options = QUIEN_PAGO_OPCIONES.map((p: QuienPago) => ({
    value: p,
    label: QUIEN_PAGO_LABEL[p],
}))

function hoyISO(): string {
    return new Date().toISOString().slice(0, 10)
}

function validar(): boolean {
    const errs: Record<string, string> = {}
    if (descripcion.value.trim().length < 3) {
        errs.descripcion = 'La descripción debe tener al menos 3 caracteres'
    }
    const montoNum = Number(monto.value)
    if (!monto.value || Number.isNaN(montoNum) || montoNum <= 0) {
        errs.monto = 'Ingresá un monto mayor a 0'
    }
    if (!quienPago.value) {
        errs.quienPago = 'Seleccioná quién pagó'
    }
    if (!fecha.value) {
        errs.fecha = 'Elegí una fecha'
    }
    fieldErrors.value = errs
    return Object.keys(errs).length === 0
}

function handleAgregar(): void {
    if (!validar()) return
    emit('crear', {
        descripcion: descripcion.value.trim(),
        monto: Number(monto.value),
        quienPago: quienPago.value as QuienPago,
        fecha: fecha.value,
    })
    descripcion.value = ''
    monto.value = ''
    quienPago.value = ''
    fecha.value = hoyISO()
    fieldErrors.value = {}
}

onMounted(() => {
    fecha.value = hoyISO()
})
</script>

<template>
  <Card>
    <div class="mb-4 flex items-center gap-3">
      <span
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-200"
      >
        <SvgIcon name="wallet" :size="18" aria-hidden="true" />
      </span>
      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Agregar gasto</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">Registrá un nuevo gasto compartido</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2" role="form" aria-label="Nuevo gasto">
      <div class="sm:col-span-2">
        <AppInput
            v-model="descripcion"
            label="Descripción"
            placeholder="Ej: Luz, Internet, Comida"
            :error="fieldErrors.descripcion"
            required
        />
      </div>

      <AppInput
          v-model="monto"
          label="Monto ($)"
          type="number"
          placeholder="0.00"
          :error="fieldErrors.monto"
          required
      />

      <AppSelect
          v-model="quienPago"
          label="¿Quién pagó?"
          :options="options"
          placeholder="Seleccioná quién pagó"
          :error="fieldErrors.quienPago"
          required
      />

      <div class="sm:col-span-2">
        <AppInput
            v-model="fecha"
            label="Fecha"
            type="date"
            :error="fieldErrors.fecha"
            required
        />
      </div>

      <div class="sm:col-span-2">
        <AppButton block icon="plus" @click="handleAgregar">Agregar gasto</AppButton>
      </div>
    </div>
  </Card>
</template>