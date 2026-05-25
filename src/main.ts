import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Импортируем store
import { useCartStore } from './stores/cart'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

// Загружаем корзину из localStorage после того, как pinia установлен
const cartStore = useCartStore()
cartStore.loadFromLocalStorage()

app.mount('#app')