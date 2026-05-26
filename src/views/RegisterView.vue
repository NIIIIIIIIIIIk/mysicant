<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-info register-info">
        <div class="info-content">
          <div class="music-notes">
            <span class="note">♪</span><span class="note">♫</span><span class="note">♪</span><span class="note">♩</span>
          </div>
          <h2>Присоединяйтесь!</h2>
          <p>Создайте аккаунт за 1 минуту</p>
        </div>
      </div>

      <div class="auth-form">
        <div class="form-header">
          <h2>Регистрация</h2>
          <p>или <router-link to="/login">войдите в аккаунт</router-link></p>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="row">
            <div class="col-6">
              <div class="input-group">
                <i class="bi bi-person"></i>
                <input type="text" v-model="firstName" placeholder="Имя" required>
              </div>
            </div>
            <div class="col-6">
              <div class="input-group">
                <i class="bi bi-person"></i>
                <input type="text" v-model="lastName" placeholder="Фамилия" required>
              </div>
            </div>
          </div>

          <div class="input-group">
            <i class="bi bi-envelope"></i>
            <input type="email" v-model="email" placeholder="Email" required>
          </div>

          <div class="input-group">
            <i class="bi bi-telephone"></i>
            <input type="tel" v-model="phone" placeholder="Телефон (необязательно)">
          </div>

          <div class="input-group">
            <i class="bi bi-lock"></i>
            <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Пароль" required>
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>

          <div class="input-group">
            <i class="bi bi-lock-fill"></i>
            <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword" placeholder="Подтвердите пароль" required>
            <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
              <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>

          <div class="password-strength" v-if="password">
            <div class="strength-bar"><div class="strength-fill" :style="{ width: passwordStrength + '%' }"></div></div>
            <span>{{ strengthText }}</span>
          </div>

          <div class="form-options">
            <label><input type="checkbox" v-model="agreeTerms" required> Я согласен с условиями</label>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else>Зарегистрироваться</span>
          </button>
        </form>

        <div class="social-buttons">
          <button class="social-btn" @click="socialRegister('google')"><i class="bi bi-google"></i> Google</button>
          <button class="social-btn" @click="socialRegister('vk')"><i class="bi bi-vk"></i> VK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { showNotification } from '../utils/notifications'

const router = useRouter()
const authStore = useAuthStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeTerms = ref(false)
const loading = ref(false)

const passwordStrength = computed(() => {
  if (!password.value) return 0
  let strength = 0
  if (password.value.length >= 6) strength += 20
  if (password.value.length >= 10) strength += 20
  if (/[A-Z]/.test(password.value)) strength += 20
  if (/[0-9]/.test(password.value)) strength += 20
  if (/[^A-Za-z0-9]/.test(password.value)) strength += 20
  return Math.min(strength, 100)
})

const strengthText = computed(() => {
  if (passwordStrength.value < 20) return 'Очень слабый'
  if (passwordStrength.value < 40) return 'Слабый'
  if (passwordStrength.value < 60) return 'Средний'
  if (passwordStrength.value < 80) return 'Хороший'
  return 'Отличный'
})

const handleRegister = async () => {
  if (!firstName.value || !firstName.value.trim()) {
    showNotification('Введите имя', 'warning')
    return
  }
  
  if (!lastName.value || !lastName.value.trim()) {
    showNotification('Введите фамилию', 'warning')
    return
  }
  
  if (!email.value || !email.value.trim()) {
    showNotification('Введите email', 'warning')
    return
  }
  
  if (!password.value || !password.value.trim()) {
    showNotification('Введите пароль', 'warning')
    return
  }
  
  if (!confirmPassword.value || !confirmPassword.value.trim()) {
    showNotification('Подтвердите пароль', 'warning')
    return
  }
  
  if (!email.value.includes('@')) {
    showNotification('Введите корректный email', 'error')
    return
  }
  
  if (password.value !== confirmPassword.value) {
    showNotification('Пароли не совпадают', 'error')
    return
  }
  
  if (password.value.length < 6) {
    showNotification('Пароль должен содержать минимум 6 символов', 'error')
    return
  }
  
  if (!agreeTerms.value) {
    showNotification('Необходимо согласиться с условиями', 'error')
    return
  }
  
  loading.value = true
  const fullName = `${firstName.value} ${lastName.value}`
  const success = await authStore.register(fullName, email.value, password.value, phone.value)
  loading.value = false
  
  if (success) {
    showNotification('Регистрация прошла успешно!', 'success')
    router.push('/profile')
  } else {
    showNotification('Ошибка регистрации. Попробуйте другой email.', 'error')
  }
}

const socialRegister = (provider) => {
  showNotification(`Регистрация через ${provider} будет доступна позже`, 'info')
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

.register-info {
  background: linear-gradient(135deg, #0f0c29, #1a1a2e);
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

.row {
  display: flex;
  gap: 16px;
  margin-bottom: 0;
}

.col-6 {
  flex: 1;
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

.password-strength {
  margin-bottom: 20px;
}

.strength-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 6px;
}

.strength-fill {
  height: 100%;
  background: #ffcc00;
  transition: width 0.3s;
}

.password-strength span {
  font-size: 0.7rem;
  color: #888;
}

.form-options {
  margin-bottom: 24px;
  color: #888;
}

.form-options input {
  margin-right: 8px;
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

.social-buttons {
  display: flex;
  gap: 12px;
}

.social-btn {
  flex: 1;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.social-btn:hover {
  background: rgba(255, 51, 102, 0.15);
  border-color: #ff3366;
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
  .row {
    flex-direction: column;
    gap: 0;
  }
}
</style>
