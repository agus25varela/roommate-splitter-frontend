import { createApp } from 'vue'
import App from './App.vue'
import router from '@/routes/index'
import { useTheme } from '@/composables/useTheme'
import '@/index.css'

const app = createApp(App)

app.use(router)

useTheme().initTheme()

app.mount('#app')