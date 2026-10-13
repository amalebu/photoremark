import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource/titillium-web/600.css'
import '@fontsource/titillium-web/700.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
