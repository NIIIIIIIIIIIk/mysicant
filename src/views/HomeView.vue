<template>
  <div class="home">
    <!-- Hero секция -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Интернет-магазин<br>музыкальных инструментов</h1>
        <p class="hero-subtitle">Лучшие инструменты от ведущих мировых брендов</p>
        <router-link to="/catalog" class="btn-hero">Перейти в каталог</router-link>
      </div>
    </section>

    <!-- Хиты продаж -->
    <section class="featured">
      <div class="container">
        <h2 class="section-title">Хиты продаж</h2>
        <div class="products-grid">
          <div v-for="product in featuredProducts" :key="product.id" class="product-card">
            <div class="product-image">
              <img :src="product.image" :alt="product.name">
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="price">{{ formatPrice(product.price) }}</p>
              <button class="add-to-cart" @click="addToCart(product)">В корзину</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { products } from '../data/products'
import { showNotification } from '../utils/notifications'

const router = useRouter()
const cartStore = useCartStore()

const featuredProducts = ref(products.slice(0, 4))

const formatPrice = (price) => {
  return price.toLocaleString('ru-RU') + ' ₽'
}

const addToCart = (product) => {
  cartStore.addItem(product)
  showNotification('Товар добавлен в корзину', 'success')
}
</script>

<style scoped>
.home {
  background: var(--bg-primary);
  min-height: calc(100vh - 200px);
}

.hero {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  padding: 80px 20px;
  text-align: center;
}

.hero-title {
  font-size: 2.5rem;
  color: white;
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 24px;
}

.btn-hero {
  display: inline-block;
  padding: 12px 30px;
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  border-radius: 30px;
  color: white;
  text-decoration: none;
  font-weight: 600;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  color: white;
  margin-bottom: 40px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 16px;
}

.product-info h3 {
  color: white;
  margin-bottom: 8px;
}

.price {
  color: #ff3366;
  font-weight: 700;
  margin-bottom: 12px;
}

.add-to-cart {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 1.8rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>
