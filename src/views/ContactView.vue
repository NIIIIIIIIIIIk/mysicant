<template>
  <div class="contacts-page">
    <div class="contacts-container">
      <!-- Hero секция -->
      <div class="contacts-hero">
        <h1><i class="bi bi-envelope-paper"></i> Контакты</h1>
        <p>Свяжитесь с нами любым удобным способом</p>
      </div>

      <div class="contacts-content">
        <!-- Левая колонка -->
        <div class="contacts-info">
          <div class="info-card">
            <h3><i class="bi bi-telephone"></i> Телефоны</h3>
            <div class="info-item">
              <i class="bi bi-phone"></i>
              <div>
                <a href="tel:+79991234567">+7 (999) 123-45-67</a>
                <span>Отдел продаж</span>
              </div>
            </div>
            <div class="info-item">
              <i class="bi bi-headset"></i>
              <div>
                <a href="tel:+79997654321">+7 (999) 765-43-21</a>
                <span>Поддержка</span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3><i class="bi bi-envelope"></i> Email</h3>
            <div class="info-item">
              <i class="bi bi-envelope-fill"></i>
              <div>
                <a href="mailto:info@musicstore.ru">info@musicstore.ru</a>
                <span>Общие вопросы</span>
              </div>
            </div>
            <div class="info-item">
              <i class="bi bi-cart"></i>
              <div>
                <a href="mailto:orders@musicstore.ru">orders@musicstore.ru</a>
                <span>Заказы</span>
              </div>
            </div>
            <div class="info-item">
              <i class="bi bi-headset"></i>
              <div>
                <a href="mailto:support@musicstore.ru">support@musicstore.ru</a>
                <span>Техподдержка</span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3><i class="bi bi-geo-alt"></i> Адрес</h3>
            <div class="info-item">
              <i class="bi bi-building"></i>
              <div>
                <p>г. Москва, ул. Музыкальная, д. 15</p>
                <span>ТЦ "Музыкальный мир", 2 этаж</span>
              </div>
            </div>
            <div class="info-item">
              <i class="bi bi-clock"></i>
              <div>
                <p>Пн-Пт: 10:00 - 21:00</p>
                <p>Сб-Вс: 11:00 - 20:00</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Правая колонка -->
        <div class="contacts-form">
          <h3><i class="bi bi-chat-dots"></i> Написать нам</h3>
          <form @submit.prevent="sendMessage">
            <div class="form-row">
              <div class="form-group">
                <label>Ваше имя *</label>
                <input type="text" v-model="form.name" required>
              </div>
              <div class="form-group">
                <label>Email *</label>
                <input type="email" v-model="form.email" required>
              </div>
            </div>
            <div class="form-group">
              <label>Тема *</label>
              <select v-model="form.subject" required>
                <option value="">Выберите тему</option>
                <option value="order">Вопрос о заказе</option>
                <option value="product">Вопрос о товаре</option>
                <option value="delivery">Доставка</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div class="form-group">
              <label>Сообщение *</label>
              <textarea v-model="form.message" rows="5" placeholder="Опишите ваш вопрос..."></textarea>
            </div>
            <button type="submit" class="submit-btn" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              <span v-else><i class="bi bi-send"></i> Отправить</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Карта -->
      <div class="contacts-map">
        <h3><i class="bi bi-map"></i> Как нас найти</h3>
        <div class="map-container">
          <iframe 
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A1a2b3c4d5e6f7g8h9i0j&source=constructor"
            width="100%" 
            height="350" 
            frameborder="0"
            allowfullscreen
          >
          </iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const loading = ref(false)

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const sendMessage = () => {
  if (!form.value.name || !form.value.email || !form.value.subject || !form.value.message) {
    alert('Пожалуйста, заполните все поля')
    return
  }
  
  loading.value = true
  
  setTimeout(() => {
    alert('✅ Сообщение отправлено! Мы свяжемся с вами в ближайшее время.')
    form.value = { name: '', email: '', subject: '', message: '' }
    loading.value = false
  }, 1000)
}

onMounted(() => {
  if (authStore.isAuthenticated && authStore.user) {
    form.value.name = authStore.userName || ''
    form.value.email = authStore.user?.email || ''
  }
})
</script>

<style scoped>
.contacts-page {
  background: var(--bg-primary);
  min-height: calc(100vh - 200px);
  padding: 40px 20px;
}

.contacts-container {
  max-width: 1200px;
  margin: 0 auto;
}

.contacts-hero {
  text-align: center;
  margin-bottom: 48px;
}

.contacts-hero h1 {
  font-size: 2rem;
  color: white;
  margin-bottom: 12px;
}

.contacts-hero p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.contacts-content {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  margin-bottom: 48px;
}

.contacts-info {
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 24px;
}

.info-card h3 {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-card h3 i {
  color: var(--accent-primary);
}

.info-item {
  display: flex;
  gap: 14px;
  margin-bottom: 18px;
}

.info-item i {
  width: 24px;
  font-size: 1.2rem;
  color: var(--accent-primary);
  margin-top: 2px;
}

.info-item a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.info-item a:hover {
  color: var(--accent-primary);
}

.info-item p {
  color: white;
  margin: 0;
}

.info-item span {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.contacts-form {
  flex: 1;
  min-width: 320px;
  background: var(--bg-card);
  border-radius: 20px;
  padding: 28px;
}

.contacts-form h3 {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.contacts-form h3 i {
  color: var(--accent-primary);
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  flex: 1;
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 0.9rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(255, 51, 102, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.contacts-map {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 24px;
}

.contacts-map h3 {
  color: white;
  font-size: 1.2rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.contacts-map h3 i {
  color: var(--accent-primary);
}

.map-container {
  border-radius: 12px;
  overflow: hidden;
}

.map-container iframe {
  display: block;
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

@media (max-width: 768px) {
  .contacts-content {
    flex-direction: column;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .contacts-hero h1 {
    font-size: 1.5rem;
  }
  
  .info-card {
    padding: 20px;
  }
  
  .contacts-form {
    padding: 20px;
  }
}
</style>