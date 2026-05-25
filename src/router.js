import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import CatalogView from './views/CatalogView.vue'
import CartView from './views/CartView.vue'
import OrderView from './views/OrderView.vue'
import LoginView from './views/LoginView.vue'
import RegisterView from './views/RegisterView.vue'
import ProfileView from './views/ProfileView.vue'
import AdminView from './views/AdminView.vue'
import ContactView from './views/ContactView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/catalog', name: 'catalog', component: CatalogView },
  { path: '/cart', name: 'cart', component: CartView },
  { path: '/order', name: 'order', component: OrderView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/admin', name: 'admin', component: AdminView, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/contacts', name: 'contacts', component: ContactView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.requiresAdmin && userRole !== 'admin') {
    next('/profile')
  } else {
    next()
  }
})

export default router