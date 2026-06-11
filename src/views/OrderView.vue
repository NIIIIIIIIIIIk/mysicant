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
              <div class="item-image"><img :src="item.image" :alt="item.name"></div>
              <div class="item-details">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-quantity">{{ item.quantity }} шт.</div>
              </div>
              <div class="item-price">{{ formatPrice(item.price * item.quantity) }}</div>
            </div>
          </div>
          <div class="summary-totals">
            <div class="total-row grand-total">
              <span>Итого</span>
              <span>{{ formatPrice(total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'
import { showNotification } from '../utils/notifications'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()

const loading = ref(false)

const order = ref({
  surname: '',
  name: '',
  phone: '',
  email: '',
  city: '',
  street: '',
  house: '',
  apartment: ''
})

const cartItems = computed(() => cartStore.items)
const total = computed(() => cartStore.totalPrice)

const formatPrice = (price) => price.toLocaleString('ru-RU') + ' ₽'

const submitOrder = async () => {
  if (!order.value.surname || !order.value.name || !order.value.phone || !order.value.email || 
      !order.value.city || !order.value.street || !order.value.house) {
    showNotification('Заполните все обязательные поля', 'warning')
    return
  }
  
  if (cartItems.value.length === 0) {
    showNotification('Корзина пуста', 'warning')
    router.push('/catalog')
    return
  }
  
  loading.value = true
  
  const fullAddress = `${order.value.city}, ул. ${order.value.street}, д. ${order.value.house}`
  const fullName = `${order.value.surname} ${order.value.name}`
  
  // Создаём заказ
  ordersStore.createOrder({
    userId: authStore.user?.id || 0,
    customerName: fullName,
    customerEmail: order.value.email,
    customerPhone: order.value.phone,
    deliveryAddress: fullAddress,
    totalAmount: total.value,
    items: cartItems.value.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }))
  })
  
  // Очищаем корзину
  cartStore.clearCart()
  
  setTimeout(() => {
    showNotification('Заказ оформлен! Ожидайте подтверждения.', 'success')
    router.push('/profile')
    loading.value = false
  }, 1000)
}
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

.form-group input {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-elevated);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  color: white;
  font-size: 0.9rem;
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
  margin-top: 20px;
}

.summary-items {
  max-height: 300px;
  overflow-y: auto;
}

.summary-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
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

.item-name {
  color: white;
  font-size: 0.85rem;
}

.item-price {
  color: #ff3366;
  font-weight: 600;
}

.grand-total {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.grand-total span:last-child {
  color: #ff3366;
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
  .form-row {
    flex-direction: column;
  }
}
</style>
