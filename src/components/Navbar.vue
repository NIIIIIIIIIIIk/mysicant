<template>
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top">
    <div class="container">
      <!-- Логотип -->
      <router-link to="/" class="navbar-brand">
        <i class="bi bi-music-note-beamed"></i>
        <span>Интернет-магазин</span>
      </router-link>

      <!-- Кнопка бургер-меню -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Меню -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Главная</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/catalog" class="nav-link">Каталог</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/cart" class="nav-link position-relative">
              Корзина
              <span v-if="cartCount" class="cart-badge">{{ cartCount }}</span>
            </router-link>
          </li>
          
          <li v-if="!authStore.isAuthenticated" class="nav-item">
            <router-link to="/login" class="nav-link btn-login">Вход</router-link>
          </li>
          <li v-if="!authStore.isAuthenticated" class="nav-item">
            <router-link to="/register" class="nav-link btn-register">Регистрация</router-link>
          </li>

          <li v-if="authStore.isAuthenticated" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <i class="bi bi-person-circle"></i> {{ authStore.userName }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li v-if="authStore.isAdmin"><router-link to="/admin" class="dropdown-item">Админ-панель</router-link></li>
              <li><router-link to="/profile" class="dropdown-item">Профиль</router-link></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-danger" href="#" @click.prevent="logout">Выйти</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const cartCount = computed(() => cartStore.totalCount)

const logout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 0.8rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

.navbar-brand {
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white !important;
}

.navbar-brand i {
  font-size: 1.5rem;
  color: #ff3366;
}

.navbar-nav {
  gap: 4px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8) !important;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem !important;
}

.nav-link:hover {
  color: #ff3366 !important;
}

/* Кнопки */
.btn-login, .btn-register {
  border-radius: 30px !important;
  padding: 0.5rem 1.2rem !important;
}

.btn-login {
  background: rgba(255, 51, 102, 0.15);
  border: 1px solid rgba(255, 51, 102, 0.3);
}

.btn-login:hover {
  background: #ff3366 !important;
  color: white !important;
}

.btn-register {
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  color: white !important;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 51, 102, 0.4);
}

/* Бейдж корзины */
.cart-badge {
  position: absolute;
  top: -5px;
  right: -10px;
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

/* Выпадающее меню */
.dropdown-menu {
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.dropdown-item {
  color: rgba(255, 255, 255, 0.8);
  padding: 8px 20px;
  transition: all 0.3s;
}

.dropdown-item:hover {
  background: rgba(255, 51, 102, 0.15);
  color: #ff3366;
}

.dropdown-divider {
  background: rgba(255, 255, 255, 0.1);
}

/* Адаптация */
@media (max-width: 992px) {
  .navbar-nav {
    margin-top: 1rem;
  }
  
  .btn-login, .btn-register {
    margin: 4px 0;
    text-align: center;
    display: inline-block;
    width: auto;
  }
  
  .dropdown-menu {
    background: transparent;
    padding-left: 1rem;
  }
  
  .dropdown-item {
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>
