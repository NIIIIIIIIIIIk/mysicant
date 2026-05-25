<template>
  <div class="order-page">
    <div class="order-container">
      <div class="order-header">
        <h1><i class="bi bi-receipt"></i> Оформление заказа</h1>
        <p>Заполните данные для доставки</p>
      </div>

      <div class="order-content">
        <!-- Форма заказа -->
        <div class="order-form">
          <div class="form-section">
            <h3><i class="bi bi-person"></i> Личные данные</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Фамилия *</label>
                <input type="text" v-model="order.surname" placeholder="Иванов" required>
              </div>
              <div class="form-group">
                <label>Имя *</label>
                <input type="text" v-model="order.name" placeholder="Иван" required>
              </div>
              <div class="form-group">
                <label>Отчество</label>
                <input type="text" v-model="order.patronymic" placeholder="Иванович">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Телефон *</label>
                <input type="tel" v-model="order.phone" placeholder="+7 (999) 123-45-67" required>
              </div>
              <div class="form-group">
                <label>Email *</label>
                <input type="email" v-model="order.email" placeholder="ivan@example.com" required>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3><i class="bi bi-geo-alt"></i> Адрес доставки</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Город *</label>
                <input type="text" v-model="order.city" placeholder="Москва" required>
              </div>
              <div class="form-group">
                <label>Улица *</label>
                <input type="text" v-model="order.street" placeholder="ул. Музыкальная" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Дом *</label>
                <input type="text" v-model="order.house" placeholder="15" required>
              </div>
              <div class="form-group">
                <label>Квартира</label>
                <input type="text" v-model="order.apartment" placeholder="42">
              </div>
              <div class="form-group">
                <label>Подъезд</label>
                <input type="text" v-model="order.entrance" placeholder="1">
              </div>
            </div>
            <div class="form-group">
              <label>Комментарий к заказу</label>
              <textarea v-model="order.comment" rows="3" placeholder="Дополнительные пожелания..."></textarea>
            </div>
          </div>

          <div class="form-section">
            <h3><i class="bi bi-truck"></i> Доставка и оплата</h3>
            <div class="delivery-options">
              <label class="radio-card">
                <input type="radio" v-model="order.delivery" value="courier">
                <div class="radio-content">
                  <i class="bi bi-truck"></i>
                  <span>Курьером</span>
                  <small>Бесплатно</small>
                </div>
              </label>
              <label class="radio-card">
                <input type="radio" v-model="order.delivery" value="pickup">
                <div class="radio-content">
                  <i class="bi bi-shop"></i>
                  <span>Самовывоз</span>
                  <small>Бесплатно</small>
                </div>
              </label>
              <label class="radio-card">
                <input type="radio" v-model="order.delivery" value="post">
                <div class="radio-content">
                  <i class="bi bi-envelope"></i>
                  <span>Почтой</span>
                  <small>от 300 ₽</small>
                </div>
              </label>
            </div>

            <div class="payment-options">
              <label class="radio-card">
                <input type="radio" v-model="order.payment" value="card">
                <div class="radio-content">
                  <i class="bi bi-credit-card"></i>
                  <span>Картой онлайн</span>
                </div>
              </label>
              <label class="radio-card">
                <input type="radio" v-model="order.payment" value="cash">
                <div class="radio-content">
                  <i class="bi bi-cash"></i>
                  <span>Наличными при получении</span>
                </div>
              </label>
              <label class="radio-card">
                <input type="radio" v-model="order.payment" value="sbp">
                <div class="radio-content">
                  <i class="bi bi-qr-code"></i>
                  <span>СБП (QR-код)</span>
                </div>
              </label>
            </div>
          </div>

          <button class="submit-btn" @click="submitOrder" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <span v-else><i class="bi bi-check-lg"></i> Оформить заказ</span>
          </button>
        </div>

        <!-- Сводка заказа -->
        <div class="order-summary">
          <h3><i class="bi bi-cart"></i> Ваш заказ</h3>
          <div class="summary-items">
            <div v-for="item in cartItems" :key="item.id" class="summary-item">
              <div class="item-image">
                <img :src="item.image" :alt="item.name">
              </div>
              <div class="item-details">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-quantity">{{ item.quantity }} шт.</div>
              </div>
              <div class="item-price">{{ formatPrice(item.price * item.quantity) }}</div>
            </div>
          </div>
          <div class="summary-totals">
            <div class="total-row">
              <span>Товары ({{ totalCount }} шт.)</span>
              <span>{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="total-row">
              <span>Доставка</span>
              <span>{{ deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost) }}</span>
            </div>
            <div class="total-divider"></div>
            <div class="total-row grand-total">
              <span>Итого</span>
              <span>{{ formatPrice(total) }}</span>
            </div>
          </div>
          <div class="promo-code">
            <input type="text" v-model="promoCode" placeholder="Промокод">
            <button @click="applyPromo">Применить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const loading = ref(false)
const promoCode = ref('')
const discount = ref(0)

const order = ref({
  surname: '',
  name: '',
  patronymic: '',
  phone: '',
  email: '',
  city: '',
  street: '',
  house: '',
  apartment: '',
  entrance: '',
  comment: '',
  delivery: 'courier',
  payment: 'card'
})

const cartItems = computed(() => cartStore.items)
const totalCount = computed(() => cartStore.totalCount)
const subtotal = computed(() => cartStore.totalPrice)
const deliveryCost = computed(() => {
  if (order.value.delivery === 'post') return 300
  return 0
})
const total = computed(() => subtotal.value + deliveryCost.value - discount.value)

const formatPrice = (price) => {
  return price.toLocaleString('ru-RU') + ' ₽'
}

const applyPromo = () => {
  if (promoCode.value === 'MUSIC2026') {
    discount.value = 500
    alert('Промокод применён! Скидка 500 ₽')
  } else if (promoCode.value === 'WELCOME') {
    discount.value = Math.floor(subtotal.value * 0.1)
    alert('Промокод применён! Скидка 10%')
  } else {
    alert('Неверный промокод')
  }
}

const submitOrder = async () => {
  // Валидация
  if (!order.value.surname || !order.value.name || !order.value.phone || !order.value.email || 
      !order.value.city || !order.value.street || !order.value.house) {
    alert('Заполните все обязательные поля')
    return
  }
  
  if (cartItems.value.length === 0) {
    alert('Корзина пуста')
    router.push('/catalog')
    return
  }
  
  loading.value = true
  
  // Формируем заказ
  const fullAddress = `${order.value.city}, ул. ${order.value.street}, д. ${order.value.house}`
  
  setTimeout(() => {
    alert('✅ Заказ успешно оформлен! Спасибо за покупку!')
    cartStore.clearCart()
    router.push('/profile')
    loading.value = false
  }, 1000)
}

// Заполняем данные авторизованного пользователя
onMounted(() => {
  if (authStore.isAuthenticated && authStore.user) {
    const nameParts = (authStore.user.name || '').split(' ')
    order.value.surname = nameParts[0] || ''
    order.value.name = nameParts[1] || ''
    order.value.email = authStore.user.email || ''
    order.value.phone = authStore.user.phone || ''
    order.value.city = authStore.user.city || ''
    order.value.street = authStore.user.street || ''
  }
  
  if (cartItems.value.length === 0) {
    alert('Корзина пуста')
    router.push('/catalog')
  }
})
</script>

<style scoped>
.order-page {
  min-height: calc(100vh - 200px);
  background: var(--bg-primary);
  padding: 40px 20px;
}

.order-container {
  max-width: 1200px;
  margin: 0 auto;
}

.order-header {
  text-align: center;
  margin-bottom: 32px;
}

.order-header h1 {
  font-size: 2rem;
  color: white;
  margin-bottom: 8px;
}

.order-header p {
  color: var(--text-secondary);
}

.order-content {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.order-form {
  flex: 2;
  min-width: 280px;
}

.order-summary {
  flex: 1;
  min-width: 280px;
  background: var(--bg-card);
  border-radius: 20px;
  padding: 20px;
  position: sticky;
  top: 100px;
  height: fit-content;
}

.form-section {
  background: var(--bg-card);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
}

.form-section h3 {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-section h3 i {
  color: var(--accent-primary);
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 120px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-size: 0.9rem;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.delivery-options, .payment-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.radio-card {
  flex: 1;
  cursor: pointer;
}

.radio-card input {
  display: none;
}

.radio-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s;
}

.radio-card input:checked + .radio-content {
  border-color: var(--accent-primary);
  background: rgba(255, 51, 102, 0.1);
}

.radio-content i {
  font-size: 1.2rem;
  color: var(--accent-primary);
}

.radio-content span {
  flex: 1;
  color: white;
}

.radio-content small {
  color: var(--text-muted);
  font-size: 0.7rem;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: var(--gradient-primary);
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 20px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Сводка заказа */
.summary-items {
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.summary-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.item-image {
  width: 50px;
  height: 50px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.item-details {
  flex: 1;
}

.item-name {
  color: white;
  font-size: 0.85rem;
}

.item-quantity {
  color: var(--text-muted);
  font-size: 0.7rem;
}

.item-price {
  color: var(--accent-primary);
  font-weight: 600;
}

.summary-totals {
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: var(--text-secondary);
}

.total-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 12px 0;
}

.grand-total {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
}

.grand-total span:last-child {
  color: var(--accent-primary);
}

.promo-code {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.promo-code input {
  flex: 1;
  padding: 10px;
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
}

.promo-code button {
  padding: 10px 16px;
  background: transparent;
  border: 1px solid var(--accent-primary);
  border-radius: 12px;
  color: var(--accent-primary);
  cursor: pointer;
  transition: all 0.3s;
}

.promo-code button:hover {
  background: var(--accent-primary);
  color: white;
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
  .order-content {
    flex-direction: column;
  }
  
  .order-summary {
    position: static;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .delivery-options, .payment-options {
    flex-direction: column;
  }
}
</style>