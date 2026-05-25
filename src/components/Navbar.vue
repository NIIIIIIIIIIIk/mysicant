<template>
  <header class="site-header">
    <div class="header-container">
      <!-- Левый блок: Логотип -->
      <div class="header-logo">
        <router-link to="/" class="logo-link">
          <i class="bi bi-music-note-beamed"></i>
          <span>Music Store</span>
        </router-link>
      </div>

      <!-- Центральный блок: Навигация (горизонтально) -->
      <nav class="header-nav">
        <router-link to="/" class="nav-link">Главная</router-link>
        <router-link to="/catalog" class="nav-link">Каталог</router-link>
        <router-link to="/cart" class="nav-link">
          Корзина
          <span v-if="cartCount" class="cart-badge">{{ cartCount }}</span>
        </router-link>
        <router-link to="/profile" class="nav-link">Профиль</router-link>
        <router-link v-if="isAdmin" to="/admin" class="nav-link admin-link">Админка</router-link>
      </nav>

      <!-- Правый блок: Поиск + Авторизация -->
      <div class="header-actions">

        <div v-if="!isAuthenticated" class="auth-buttons">
          <router-link to="/login" class="btn-login">Вход</router-link>
          <router-link to="/register" class="btn-register">Регистрация</router-link>
        </div>

        <div v-else class="user-menu">
          <button class="user-btn" @click="toggleDropdown">
            <i class="bi bi-person-circle"></i>
            <span>{{ userName }}</span>
            <i class="bi bi-chevron-down"></i>
          </button>
          <div v-show="dropdownOpen" class="dropdown-menu" @click.stop>
            <router-link to="/profile" class="dropdown-item">Профиль</router-link>
            <router-link to="/profile?tab=orders" class="dropdown-item">Заказы</router-link>
            <router-link to="/profile?tab=wishlist" class="dropdown-item">Избранное</router-link>
            <hr class="dropdown-divider">
            <button class="dropdown-item logout" @click="handleLogout">Выйти</button>
          </div>
        </div>

        <!-- Мобильное меню (бургер) -->
        <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- Мобильное меню (выпадающее) -->
    <div v-show="mobileMenuOpen" class="mobile-menu">
      <router-link to="/" class="mobile-link" @click="mobileMenuOpen = false">Главная</router-link>
      <router-link to="/catalog" class="mobile-link" @click="mobileMenuOpen = false">Каталог</router-link>
      <router-link to="/cart" class="mobile-link" @click="mobileMenuOpen = false">Корзина</router-link>
      <router-link to="/profile" class="mobile-link" @click="mobileMenuOpen = false">Профиль</router-link>
      <router-link v-if="isAdmin" to="/admin" class="mobile-link" @click="mobileMenuOpen = false">Админка</router-link>
      <div class="mobile-divider"></div>
      <div v-if="!isAuthenticated">
        <router-link to="/login" class="mobile-link" @click="mobileMenuOpen = false">Вход</router-link>
        <router-link to="/register" class="mobile-link" @click="mobileMenuOpen = false">Регистрация</router-link>
      </div>
      <button v-else class="mobile-link logout-btn" @click="handleLogout">Выйти</button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const dropdownOpen = ref(false)
const mobileMenuOpen = ref(false)

const cartCount = computed(() => cartStore.totalCount)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const userName = computed(() => authStore.userName)

const search = () => {
  if (searchQuery.value.trim()) {
    router.push(`/catalog?search=${encodeURIComponent(searchQuery.value)}`)
    searchQuery.value = ''
  }
}

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const handleLogout = async () => {
  await authStore.logout()
  dropdownOpen.value = false
  mobileMenuOpen.value = false
  router.push('/')
}

// Закрыть дропдаун при клике вне
const handleClickOutside = (event) => {
  const userMenu = document.querySelector('.user-menu')
  if (userMenu && !userMenu.contains(event.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* ===== ОСНОВНЫЕ СТИЛИ ===== */
.site-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-bottom: 1px solid rgba(255, 51, 102, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  padding: 12px 0;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

/* ===== ЛОГОТИП ===== */
.logo-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 700;
}

.logo-link i {
  font-size: 1.6rem;
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-link span {
  background: linear-gradient(135deg, #fff, #ff3366);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ===== НАВИГАЦИЯ (ГОРИЗОНТАЛЬНО) ===== */
.header-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 30px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #ff3366;
  background: rgba(255, 51, 102, 0.1);
}

.nav-link.router-link-active {
  color: #ff3366;
  background: rgba(255, 51, 102, 0.15);
}

.admin-link {
  border: 1px solid rgba(255, 51, 102, 0.3);
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: 4px;
  background: #ff3366;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 20px;
  min-width: 18px;
  text-align: center;
}

/* ===== ПОИСК ===== */
.search-wrapper {
  position: relative;
}

.search-wrapper i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 0.9rem;
}

.search-input {
  padding: 8px 12px 8px 36px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  color: white;
  font-size: 0.85rem;
  width: 200px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #ff3366;
  width: 240px;
  background: rgba(255, 51, 102, 0.1);
}

.search-input::placeholder {
  color: #666;
}

/* ===== КНОПКИ АВТОРИЗАЦИИ ===== */
.auth-buttons {
  display: flex;
  gap: 8px;
}

.btn-login, .btn-register {
  padding: 8px 20px;
  border-radius: 30px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-login {
  background: transparent;
  border: 1px solid rgba(255, 51, 102, 0.3);
  color: #ff3366;
}

.btn-login:hover {
  background: #ff3366;
  color: white;
  transform: translateY(-2px);
}

.btn-register {
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  color: white;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 51, 102, 0.4);
}

/* ===== ПОЛЬЗОВАТЕЛЬСКОЕ МЕНЮ ===== */
.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  cursor: pointer;
  color: white;
  transition: all 0.3s;
}

.user-btn:hover {
  border-color: #ff3366;
  background: rgba(255, 51, 102, 0.1);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  z-index: 100;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.85rem;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: rgba(255, 51, 102, 0.15);
  color: #ff3366;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 8px 0;
}

.logout {
  color: #ff4444;
}

.logout:hover {
  background: rgba(255, 68, 68, 0.15);
  color: #ff4444;
}

/* ===== МОБИЛЬНОЕ МЕНЮ ===== */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.mobile-menu-btn span {
  width: 24px;
  height: 2px;
  background: white;
  transition: all 0.3s;
}

.mobile-menu {
  display: none;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  background: #1a1a2e;
  border-bottom: 1px solid rgba(255, 51, 102, 0.2);
  padding: 16px;
  flex-direction: column;
  gap: 8px;
  z-index: 99;
}

.mobile-link {
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.2s;
}

.mobile-link:hover {
  background: rgba(255, 51, 102, 0.1);
  color: #ff3366;
}

.mobile-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 8px 0;
}

.logout-btn {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
}

/* ===== АДАПТАЦИЯ ===== */
@media (max-width: 992px) {
  .header-nav {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .mobile-menu {
    display: flex;
  }
  
  .search-input {
    width: 150px;
  }
  
  .btn-login span, .btn-register span {
    display: none;
  }
  
  .btn-login, .btn-register {
    padding: 8px 12px;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }
  
  .logo-link span {
    display: none;
  }
  
  .search-wrapper {
    display: none;
  }
  
  .user-btn span {
    display: none;
  }
  
  .user-btn {
    padding: 6px 10px;
  }
}
</style>