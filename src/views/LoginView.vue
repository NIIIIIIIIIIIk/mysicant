<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-info login-info">
        <div class="info-content">
          <div class="music-notes">
            <span class="note">♪</span><span class="note">♫</span><span class="note">♪</span><span class="note">♩</span>
          </div>
          <h2>Добро пожаловать!</h2>
          <p>Войдите в свой аккаунт</p>
        </div>
      </div>

      <div class="auth-form">
        <div class="form-header">
          <h2>Вход в аккаунт</h2>
          <p>или <router-link to="/register">зарегистрируйтесь</router-link></p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <i class="bi bi-envelope"></i>
            <input type="email" v-model="email" placeholder="Email" required>
          </div>

          <div class="input-group">
            <i class="bi bi-lock"></i>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Пароль" required>
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>

          <div class="form-options">
            <label><input type="checkbox" v-model="rememberMe"> Запомнить меня</label>
            <a href="#" @click.prevent="showForgotMessage">Забыли пароль?</a>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Войти</span>
          </button>
        </form>

        <div class="demo-accounts">
          <p>Тестовые аккаунты:</p>
          <button class="demo-btn admin" @click="fillDemo('admin@musicstore.ru', 'admin123')">Администратор</button>
          <button class="demo-btn user" @click="fillDemo('user@example.com', 'user123')">Пользователь</button>
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

const handleLogin = async () => {
  if (!email.value || !email.value.trim()) {
    showNotification('Введите email', 'warning')
    return
  }
  
  if (!password.value || !password.value.trim()) {
    showNotification('Введите пароль', 'warning')
    return
  }
  
  loading.value = true
  const success = await authStore.login(email.value, password.value, rememberMe.value)
  loading.value = false
  
  if (success) {
    showNotification('Вы успешно вошли в систему', 'success')
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
  showNotification('Тестовые данные вставлены', 'info')
}

const showForgotMessage = () => {
  showNotification('Для восстановления пароля обратитесь к администратору', 'info')
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--bg-primary);
}

.auth-container {
  display: flex;
  max-width: 1000px;
  width: 100%;
  background: var(--bg-card);
  border-radius: 24px;
  overflow: hidden;
}

.auth-info {
  flex: 1;
  padding: 48px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  position: relative;
  overflow: hidden;
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
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.05);
  animation: floatNote 8s infinite;
}

.note:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
.note:nth-child(2) { top: 60%; right: 15%; animation-delay: 2s; }
.note:nth-child(3) { bottom: 20%; left: 20%; animation-delay: 4s; }
.note:nth-child(4) { top: 30%; right: 30%; animation-delay: 6s; }

@keyframes floatNote {
  0%,100% { transform: translateY(0); opacity: 0.05; }
  50% { transform: translateY(-20px); opacity: 0.15; }
}

.info-content {
  position: relative;
  z-index: 1;
  color: white;
}

.info-content h2 {
  font-size: 2rem;
  margin-bottom: 16px;
}

.info-content p {
  opacity: 0.8;
}

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

.form-header a {
  color: #ff3366;
  text-decoration: none;
}

.input-group {
  position: relative;
  margin-bottom: 20px;
}

.input-group i {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  z-index: 1;
}

.input-group input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
}

.input-group input:focus {
  outline: none;
  border-color: #ff3366;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  color: #888;
}

.form-options a {
  color: #ff3366;
  text-decoration: none;
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
  margin-bottom: 24px;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.demo-accounts {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.demo-accounts p {
  color: #888;
  font-size: 0.8rem;
  margin-bottom: 12px;
}

.demo-btn {
  padding: 8px 16px;
  margin: 0 8px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
}

.demo-btn.admin {
  background: rgba(255, 51, 102, 0.2);
  color: #ff3366;
  border: 1px solid rgba(255, 51, 102, 0.3);
}

.demo-btn.user {
  background: rgba(255, 107, 61, 0.2);
  color: #ff6b3d;
  border: 1px solid rgba(255, 107, 61, 0.3);
}

.demo-btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
  }
  .auth-info {
    padding: 32px;
  }
  .auth-form {
    padding: 32px;
  }
}
</style>
