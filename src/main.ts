import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useCartStore } from './stores/cart'
import { useOrdersStore } from './stores/orders'
import './assets/main.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

// Загружаем данные из localStorage
const cartStore = useCartStore()
const ordersStore = useOrdersStore()
cartStore.loadFromLocalStorage()
ordersStore.loadFromLocalStorage()

app.mount('#app')
