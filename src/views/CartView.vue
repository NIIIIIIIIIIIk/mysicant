<template>
  <div class="cart-page">
    <div class="cart-header">
      <h1>🛒 Корзина</h1>
      <p v-if="cartStore.items.length > 0">{{ cartStore.totalCount }} товаров</p>
    </div>

    <div v-if="cartStore.items.length === 0" class="empty-cart">
      <i class="bi bi-cart-x"></i>
      <h3>Корзина пуста</h3>
      <p>Добавьте товары из каталога</p>
      <router-link to="/catalog" class="continue-shopping">Перейти в каталог</router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
          <div class="item-image">
            <img :src="item.image" :alt="item.name">
          </div>
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p class="item-brand">{{ item.brand }}</p>
          </div>
          <div class="item-quantity">
            <button class="qty-btn" @click="updateQuantity(item.id, item.quantity - 1)">-</button>
            <span class="qty-value">{{ item.quantity }}</span>
            <button class="qty-btn" @click="updateQuantity(item.id, item.quantity + 1)">+</button>
          </div>
          <div class="item-total">{{ formatPrice(item.price * item.quantity) }}</div>
          <button class="remove-btn" @click="removeItem(item.id)">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>

      <div class="cart-summary">
        <h3>Итого</h3>
        <div class="summary-row">
          <span>Товары ({{ cartStore.totalCount }} шт.)</span>
          <span>{{ formatPrice(cartStore.totalPrice) }}</span>
        </div>
        <div class="summary-row">
          <span>Доставка</span>
          <span>Бесплатно</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-row total">
          <span>К оплате</span>
          <span class="total-price">{{ formatPrice(cartStore.totalPrice) }}</span>
        </div>
        <router-link to="/order" class="checkout-btn">Оформить заказ</router-link>
        <button class="clear-cart-btn" @click="clearCart">Очистить корзину</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

const formatPrice = (price) => {
  return price.toLocaleString('ru-RU') + ' ₽'
}

const updateQuantity = (id, quantity) => {
  if (quantity < 1) {
    cartStore.removeItem(id)
  } else {
    cartStore.updateQuantity(id, quantity)
  }
}

const removeItem = (id) => {
  if (confirm('Удалить товар из корзины?')) {
    cartStore.removeItem(id)
  }
}

const clearCart = () => {
  if (confirm('Очистить всю корзину?')) {
    cartStore.clearCart()
  }
}
</script>

<style scoped>
.cart-page {
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.cart-header {
  text-align: center;
  margin-bottom: 30px;
}

.cart-header h1 {
  font-size: 2rem;
  color: white;
}

.empty-cart {
  text-align: center;
  padding: 60px;
  background: var(--bg-card);
  border-radius: 20px;
}

.empty-cart i {
  font-size: 4rem;
  color: var(--text-muted);
}

.empty-cart h3 {
  color: white;
  margin: 15px 0;
}

.continue-shopping {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 25px;
  background: var(--gradient-primary);
  border-radius: 25px;
  color: white;
  text-decoration: none;
}

.cart-content {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
}

.cart-items {
  flex: 2;
  min-width: 280px;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 20px;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.item-image {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.item-info {
  flex: 2;
  min-width: 120px;
}

.item-info h3 {
  color: white;
  font-size: 1rem;
  margin: 0 0 4px;
}

.item-brand {
  font-size: 0.75rem;
  color: var(--accent-primary);
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--bg-elevated);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  cursor: pointer;
}

.qty-value {
  color: white;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.item-total {
  font-weight: 700;
  color: white;
  min-width: 100px;
  text-align: right;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  font-size: 1.2rem;
}

.cart-summary {
  flex: 1;
  min-width: 280px;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 20px;
  position: sticky;
  top: 100px;
  height: fit-content;
}

.cart-summary h3 {
  color: white;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: var(--text-secondary);
}

.summary-divider {
  height: 1px;
  background: rgba(255,255,255,0.1);
  margin: 15px 0;
}

.summary-row.total {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 20px;
}

.total-price {
  color: var(--accent-primary);
}

.checkout-btn {
  display: block;
  width: 100%;
  padding: 14px;
  background: var(--gradient-primary);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  margin-bottom: 10px;
}

.clear-cart-btn {
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  color: var(--text-secondary);
  cursor: pointer;
}

@media (max-width: 768px) {
  .cart-item {
    flex-direction: column;
    text-align: center;
  }
  .item-image {
    margin: 0 auto;
  }
  .item-quantity {
    justify-content: center;
  }
  .item-total {
    text-align: center;
  }
  .cart-summary {
    position: static;
  }
}
</style>