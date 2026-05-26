<template>
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top">
    <div class="container-fluid px-3 px-md-5">
      <!-- Логотип - без Music Store -->
      <router-link to="/" class="navbar-brand">
        <i class="bi bi-music-note-beamed"></i>
        <span class="brand-text">Интернет-магазин</span>
      </router-link>

      <!-- Мобильная корзина -->
      <router-link to="/cart" class="mobile-cart d-lg-none">
        <i class="bi bi-cart"></i>
        <span v-if="cartCount" class="cart-badge-mobile">{{ cartCount }}</span>
      </router-link>

      <!-- Кнопка бургер-меню -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Основное меню -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Главная</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/catalog" class="nav-link">Каталог</router-link>
          </li>
          <li class="nav-item d-none d-md-block">
            <router-link to="/cart" class="nav-link position-relative">
              Корзина
              <span v-if="cartCount" class="cart-badge">{{ cartCount }}</span>
            </router-link>
          </li>
          
          <template v-if="!authStore.isAuthenticated">
            <li class="nav-item"><router-link to="/login" class="nav-link btn-login">Вход</router-link></li>
            <li class="nav-item"><router-link to="/register" class="nav-link btn-register">Регистрация</router-link></li>
          </template>

          <template v-else>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle user-dropdown" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle"></i>
                <span class="user-name">{{ authStore.userName }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li v-if="authStore.isAdmin"><router-link to="/admin" class="dropdown-item">Админ-панель</router-link></li>
                <li><router-link to="/profile" class="dropdown-item">Профиль</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="#" @click.prevent="logout">Выйти</a></li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>

    <!-- Мобильное меню -->
    <div class="mobile-menu" :class="{ open: mobileMenuOpen }">
      <div class="mobile-menu-content">
        <router-link to="/" class="mobile-nav-link">Главная</router-link>
        <router-link to="/catalog" class="mobile-nav-link">Каталог</router-link>
        <router-link to="/cart" class="mobile-nav-link">Корзина</router-link>
        <div class="mobile-divider"></div>
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/login" class="mobile-nav-link">Вход</router-link>
          <router-link to="/register" class="mobile-nav-link">Регистрация</router-link>
        </template>
        <template v-else>
          <router-link to="/profile" class="mobile-nav-link">Профиль</router-link>
          <div v-if="authStore.isAdmin"><router-link to="/admin" class="mobile-nav-link">Админ-панель</router-link></div>
          <a href="#" class="mobile-nav-link text-danger" @click.prevent="logout">Выйти</a>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const cartCount = computed(() => cartStore.totalCount)
const mobileMenuOpen = ref(false)

const closeMenu = () => {
  mobileMenuOpen.value = false
  const navbarCollapse = document.getElementById('navbarNav')
  if (navbarCollapse && navbarCollapse.classList.contains('show')) {
    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse)
    if (bsCollapse) bsCollapse.hide()
  }
}

const logout = async () => {
  await authStore.logout()
  closeMenu()
  router.push('/')
}

const handleClickOutside = (event) => {
  const mobileMenu = document.querySelector('.mobile-menu')
  const menuBtn = document.querySelector('.navbar-toggler')
  if (mobileMenu && mobileMenu.classList.contains('open') && 
      !mobileMenu.contains(event.target) && 
      !menuBtn?.contains(event.target)) {
    mobileMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  cartStore.loadFromLocalStorage()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 0.8rem 0;
}

.navbar-brand {
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.navbar-brand i {
  font-size: 1.5rem;
  color: #ff3366;
}

.brand-text {
  color: white;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8) !important;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem !important;
}

.nav-link:hover {
  color: #ff3366 !important;
}

.btn-login, .btn-register {
  border-radius: 30px !important;
  margin-left: 8px;
}

.btn-login {
  background: rgba(255, 51, 102, 0.15);
  border: 1px solid rgba(255, 51, 102, 0.3);
}

.btn-register {
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff3366;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-cart {
  position: relative;
  color: white;
  font-size: 1.2rem;
  margin-left: auto;
  margin-right: 15px;
  text-decoration: none;
}

.cart-badge-mobile {
  position: absolute;
  top: -8px;
  right: -12px;
  background: #ff3366;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  max-width: 320px;
  height: 100vh;
  background: #1a1a2e;
  transition: right 0.3s ease;
  z-index: 1000;
  padding-top: 80px;
}

.mobile-menu.open {
  right: 0;
}

.mobile-menu-content {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 12px;
}

.mobile-nav-link:hover {
  background: rgba(255, 51, 102, 0.15);
  color: #ff3366;
}

.mobile-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 12px 0;
}

.user-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-menu {
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dropdown-item {
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s;
}

.dropdown-item:hover {
  background: rgba(255, 51, 102, 0.15);
  color: #ff3366;
}

@media (max-width: 768px) {
  .brand-text {
    display: none;
  }
  
  .user-name {
    display: none;
  }
}
</style>
