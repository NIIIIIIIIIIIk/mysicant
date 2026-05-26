<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Левая часть с информацией -->
      <div class="auth-info login-info">
        <div class="info-content">
          <div class="music-notes">
            <span class="note">♪</span>
            <span class="note">♫</span>
            <span class="note">♪</span>
            <span class="note">♩</span>
          </div>
          <div class="info-logo">
            <i class="bi bi-music-note-beamed"></i>
            <span>Music Store</span>
          </div>
          <h2>Добро пожаловать!</h2>
          <p>Войдите в свой аккаунт, чтобы продолжить покупки</p>
          <div class="features-list">
            <div class="feature"><i class="bi bi-check-circle-fill"></i><span>Быстрое оформление заказов</span></div>
            <div class="feature"><i class="bi bi-check-circle-fill"></i><span>История покупок</span></div>
            <div class="feature"><i class="bi bi-check-circle-fill"></i><span>Избранные товары</span></div>
            <div class="feature"><i class="bi bi-check-circle-fill"></i><span>Персональные скидки</span></div>
          </div>
        </div>
      </div>

      <!-- Правая часть с формой -->
      <div class="auth-form">
        <div class="form-header">
          <h2>Вход в аккаунт</h2>
          <p>или <router-link to="/register">создайте новый аккаунт</router-link></p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <div class="input-icon"><i class="bi bi-envelope"></i></div>
            <input type="email" v-model="email" placeholder="Email" required :class="{ 'error': emailError }">
          </div>

          <div class="input-group">
            <div class="input-icon"><i class="bi bi-lock"></i></div>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Пароль" required :class="{ 'error': passwordError }">
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>

          <div class="form-options">
            <label class="checkbox"><input type="checkbox" v-model="rememberMe"><span>Запомнить меня</span></label>
            <a href="#" class="forgot-link" @click.prevent="showForgotMessage">Забыли пароль?</a>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <span v-else><i class="bi bi-box-arrow-in-right"></i> Войти</span>
          </button>

          <div class="divider"><span>или войдите с помощью</span></div>

          <div class="social-buttons">
            <button type="button" class="social-btn google" @click="socialLogin('google')"><i class="bi bi-google"></i> Google</button>
            <button type="button" class="social-btn vk" @click="socialLogin('vk')"><i class="bi bi-vk"></i> VK</button>
            <button type="button" class="social-btn github" @click="socialLogin('github')"><i class="bi bi-github"></i> GitHub</button>
          </div>
        </form>

        <div class="demo-accounts">
          <p class="demo-title">🍪 Тестовые аккаунты</p>
          <div class="demo-buttons">
            <button class="demo-btn admin" @click="fillDemo('admin@musicstore.ru', 'admin123')"><i class="bi bi-shield-lock"></i> Администратор</button>
            <button class="demo-btn user" @click="fillDemo('user@example.com', 'user123')"><i class="bi bi-person"></i> Пользователь</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { showNotification } from '../utils/notifications'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const emailError = ref(false)
const passwordError = ref(false)

const handleLogin = async () => {
  // Валидация полей
  emailError.value = !email.value
  passwordError.value = !password.value
  
  if (!email.value || !password.value) {
    showNotification('Заполните все поля', 'warning')
    return
  }
  
  loading.value = true
  const success = await authStore.login(email.value, password.value, rememberMe.value)
  loading.value = false
  
  if (success) {
    showNotification('Добро пожаловать!', 'success')
    const userRole = localStorage.getItem('userRole')
    if (userRole === 'admin') {
      router.push('/admin')
    } else {
      router.push('/profile')
    }
  } else {
    showNotification('Неверный email или пароль', 'error')
  }
}

const fillDemo = (demoEmail, demoPassword) => {
  email.value = demoEmail
  password.value = demoPassword
  emailError.value = false
  passwordError.value = false
  showNotification('Тестовые данные вставлены', 'info')
}

const socialLogin = (provider) => {
  showNotification(`Авторизация через ${provider} будет доступна позже`, 'info')
}

const showForgotMessage = () => {
  showNotification('Для восстановления пароля обратитесь к администратору', 'info')
}
</script>

<style scoped>
/* ===== СТИЛИ ДЛЯ СТРАНИЦЫ ВХОДА ===== */

.auth-page {
  min-height: calc(100vh - 80px);
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.auth-container {
  display: flex;
  max-width: 1200px;
  width: 100%;
  background: var(--bg-card);
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

/* ===== ЛЕВАЯ ЧАСТЬ ===== */
.auth-info {
  flex: 1;
  padding: 48px;
  position: relative;
  overflow: hidden;
}

.login-info {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.music-notes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.note {
  position: absolute;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.08);
  animation: floatNote 8s ease-in-out infinite;
}

.note:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
.note:nth-child(2) { top: 50%; right: 15%; animation-delay: 2s; }
.note:nth-child(3) { bottom: 20%; left: 20%; animation-delay: 4s; }
.note:nth-child(4) { top: 30%; right: 30%; animation-delay: 6s; }

@keyframes floatNote {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
  50% { transform: translateY(-20px) rotate(10deg); opacity: 0.3; }
}

.info-content {
  position: relative;
  z-index: 1;
  color: white;
}

.info-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 40px;
}

.info-logo i {
  font-size: 2rem;
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.info-logo span {
  background: linear-gradient(135deg, #fff, #ff3366);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.info-content h2 {
  font-size: 2rem;
  margin-bottom: 16px;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.info-content > p {
  opacity: 0.95;
  color: #f0f0f0;
  font-weight: 500;
  margin-bottom: 32px;
  line-height: 1.5;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #e0e0e0;
}

.feature i {
  font-size: 1.2rem;
  color: #ffcc00;
}

/* ===== ПРАВАЯ ЧАСТЬ ===== */
.auth-form {
  flex: 1;
  padding: 48px;
  background: var(--bg-secondary);
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.form-header h2 {
  font-size: 1.8rem;
  color: white;
  margin-bottom: 8px;
}

.form-header p {
  color: var(--text-secondary);
}

.form-header a {
  color: var(--accent-primary);
  text-decoration: none;
}

.form-header a:hover {
  text-decoration: underline;
}

/* ===== INPUTS ===== */
.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  z-index: 1;
}

.input-group input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  color: white;
  font-size: 1rem;
  transition: all var(--transition-normal);
}

.input-group input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(255, 51, 102, 0.1);
}

.input-group input.error {
  border-color: #ff4444;
  background: rgba(255, 68, 68, 0.05);
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}

/* ===== ФОРМА ===== */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  cursor: pointer;
}

.checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.forgot-link {
  color: var(--accent-primary);
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-link:hover {
  text-decoration: underline;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  margin-bottom: 24px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(255, 51, 102, 0.3);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* ===== РАЗДЕЛИТЕЛЬ ===== */
.divider {
  text-align: center;
  margin-bottom: 24px;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 100px);
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.divider::before { left: 0; }
.divider::after { right: 0; }

.divider span {
  background: var(--bg-secondary);
  padding: 0 16px;
  color: var(--text-muted);
  font-size: 0.8rem;
}

/* ===== СОЦИАЛЬНЫЕ КНОПКИ ===== */
.social-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}

.social-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: transparent;
  color: white;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}

/* ===== ТЕСТОВЫЕ АККАУНТЫ ===== */
.demo-accounts {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 24px;
}

.demo-title {
  color: var(--text-secondary);
  font-size: 0.8rem;
  text-align: center;
  margin-bottom: 12px;
}

.demo-buttons {
  display: flex;
  gap: 12px;
}

.demo-btn {
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.demo-btn.admin {
  background: rgba(255, 51, 102, 0.15);
  color: #ff3366;
  border: 1px solid rgba(255, 51, 102, 0.3);
}

.demo-btn.user {
  background: rgba(255, 107, 61, 0.15);
  color: #ff6b3d;
  border: 1px solid rgba(255, 107, 61, 0.3);
}

.demo-btn:hover {
  transform: translateY(-2px);
}

/* ===== АДАПТАЦИЯ ===== */
@media (max-width: 992px) {
  .auth-container {
    flex-direction: column;
  }
  
  .auth-info {
    padding: 32px;
  }
  
  .features-list {
    display: none;
  }
  
  .auth-form {
    padding: 32px;
  }
}

@media (max-width: 768px) {
  .form-header h2 {
    font-size: 1.5rem;
  }
  
  .social-buttons {
    flex-wrap: wrap;
  }
  
  .demo-buttons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 20px;
  }
  
  .auth-form {
    padding: 24px;
  }
}
</style>
