<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Левая часть с информацией -->
      <div class="auth-info register-info">
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
          <h2>Присоединяйтесь!</h2>
          <p>Создайте аккаунт и получите доступ к эксклюзивным предложениям</p>
          <div class="stats">
            <div class="stat">
              <span class="stat-number">500+</span>
              <span class="stat-label">инструментов</span>
            </div>
            <div class="stat">
              <span class="stat-number">10 000+</span>
              <span class="stat-label">клиентов</span>
            </div>
            <div class="stat">
              <span class="stat-number">5 лет</span>
              <span class="stat-label">гарантии</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Правая часть с формой -->
      <div class="auth-form">
        <div class="form-header">
          <h2>Регистрация</h2>
          <p>или <router-link to="/login">войдите в аккаунт</router-link></p>
        </div>

        <form @submit.prevent="handleRegister">
          <div class="row">
            <div class="col-6">
              <div class="input-group">
                <div class="input-icon">
                  <i class="bi bi-person"></i>
                </div>
                <input 
                  type="text" 
                  v-model="firstName" 
                  placeholder="Имя" 
                  required
                  :class="{ 'error': firstNameError }"
                >
              </div>
            </div>
            <div class="col-6">
              <div class="input-group">
                <div class="input-icon">
                  <i class="bi bi-person"></i>
                </div>
                <input 
                  type="text" 
                  v-model="lastName" 
                  placeholder="Фамилия" 
                  required
                  :class="{ 'error': lastNameError }"
                >
              </div>
            </div>
          </div>

          <div class="input-group">
            <div class="input-icon">
              <i class="bi bi-envelope"></i>
            </div>
            <input 
              type="email" 
              v-model="email" 
              placeholder="Email" 
              required
              :class="{ 'error': emailError }"
            >
          </div>

          <div class="input-group">
            <div class="input-icon">
              <i class="bi bi-telephone"></i>
            </div>
            <input 
              type="tel" 
              v-model="phone" 
              placeholder="Телефон (необязательно)"
            >
          </div>

          <div class="input-group">
            <div class="input-icon">
              <i class="bi bi-lock"></i>
            </div>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="password" 
              placeholder="Пароль" 
              required
              :class="{ 'error': passwordError }"
            >
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>

          <div class="input-group">
            <div class="input-icon">
              <i class="bi bi-lock-fill"></i>
            </div>
            <input 
              :type="showConfirmPassword ? 'text' : 'password'" 
              v-model="confirmPassword" 
              placeholder="Подтвердите пароль" 
              required
              :class="{ 'error': confirmError }"
            >
            <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
              <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>

          <div class="password-strength" v-if="password">
            <div class="strength-bar">
              <div class="strength-fill" :style="{ width: passwordStrength + '%', background: strengthColor }"></div>
            </div>
            <span class="strength-text">{{ strengthText }}</span>
          </div>

          <div class="form-options">
            <label class="checkbox">
              <input type="checkbox" v-model="agreeTerms" required>
              <span>Я согласен с <a href="#">условиями использования</a> и <a href="#">политикой конфиденциальности</a></span>
            </label>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <span v-else><i class="bi bi-person-plus"></i> Зарегистрироваться</span>
          </button>

          <div class="divider">
            <span>или зарегистрируйтесь через</span>
          </div>

          <div class="social-buttons">
            <button type="button" class="social-btn google" @click="socialRegister('google')">
              <i class="bi bi-google"></i> Google
            </button>
            <button type="button" class="social-btn vk" @click="socialRegister('vk')">
              <i class="bi bi-vk"></i> VK
            </button>
            <button type="button" class="social-btn github" @click="socialRegister('github')">
              <i class="bi bi-github"></i> GitHub
            </button>
          </div>
        </form>
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

// Ошибки валидации
const firstNameError = computed(() => firstName.value && firstName.value.length < 2)
const lastNameError = computed(() => lastName.value && lastName.value.length < 2)
const emailError = computed(() => email.value && !email.value.includes('@'))
const passwordError = computed(() => password.value && password.value.length < 6)
const confirmError = computed(() => confirmPassword.value && confirmPassword.value !== password.value)

// Индикатор сложности пароля
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

const strengthColor = computed(() => {
  if (passwordStrength.value < 20) return '#ff4444'
  if (passwordStrength.value < 40) return '#ff8844'
  if (passwordStrength.value < 60) return '#ffcc00'
  if (passwordStrength.value < 80) return '#44cc44'
  return '#00ff88'
})

const handleRegister = async () => {
  // Валидация полей
  if (!firstName.value || !lastName.value || !email.value || !password.value) {
    showNotification('Заполните все обязательные поля', 'warning')
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
    showNotification('Необходимо согласиться с условиями использования', 'error')
    return
  }
  
  if (!email.value.includes('@')) {
    showNotification('Введите корректный email', 'error')
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
  showNotification(`🔐 Регистрация через ${provider} будет доступна в ближайшее время`, 'info')
}
</script>

<style scoped>
/* ============================================
   СТИЛИ ДЛЯ СТРАНИЦЫ РЕГИСТРАЦИИ
   ============================================ */

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

.register-info {
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

.stats {
  display: flex;
  gap: 24px;
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.stat {
  text-align: center;
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffcc00;
}

.stat-label {
  font-size: 0.8rem;
  color: #e0e0e0;
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

/* ===== ИНДИКАТОР СЛОЖНОСТИ ПАРОЛЯ ===== */
.password-strength {
  margin-bottom: 20px;
}

.strength-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.strength-text {
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* ===== ЧЕКБОКС ===== */
.form-options {
  margin-bottom: 24px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.85rem;
}

.checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox a {
  color: var(--accent-primary);
  text-decoration: none;
}

.checkbox a:hover {
  text-decoration: underline;
}

/* ===== КНОПКА ОТПРАВКИ ===== */
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

/* ===== АДАПТАЦИЯ ===== */
@media (max-width: 992px) {
  .auth-container {
    flex-direction: column;
  }
  
  .auth-info {
    padding: 32px;
  }
  
  .stats {
    display: none;
  }
  
  .auth-form {
    padding: 32px;
  }
}

@media (max-width: 768px) {
  .row {
    flex-direction: column;
    gap: 0;
  }
  
  .form-header h2 {
    font-size: 1.5rem;
  }
  
  .social-buttons {
    flex-wrap: wrap;
  }
  
  .social-btn {
    flex: auto;
    min-width: calc(33.33% - 8px);
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 20px;
  }
  
  .auth-form {
    padding: 24px;
  }
  
  .social-buttons {
    flex-direction: column;
  }
  
  .social-btn {
    width: 100%;
  }
}
</style>
