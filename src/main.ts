import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './styles/main.scss'
import App from './App.vue'

createApp(App).use(createPinia()).use(router).mount('#app')
