<template>
  <div class="home">
    <!-- Hero секция -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Music Store</h1>
        <p class="hero-subtitle">Магазин музыкальных инструментов</p>
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

const router = useRouter()
const cartStore = useCartStore()

// Хиты продаж - берём первые 4 товара из каталога
const featuredProducts = ref(products.slice(0, 4))

// Категории с фотографиями
const categories = ref([
  { id: 1, name: 'Гитары', slug: 'guitar', count: 24, image: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=400' },
  { id: 2, name: 'Клавишные', slug: 'piano', count: 18, image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400' },
  { id: 3, name: 'Ударные', slug: 'drums', count: 12, image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400' },
  { id: 4, name: 'Аксессуары', slug: 'accessories', count: 36, image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400' }
])

const formatPrice = (price) => {
  return price.toLocaleString('ru-RU') + ' ₽'
}

const addToCart = (product) => {
  cartStore.addItem(product)
  alert(`✅ ${product.name} добавлен в корзину!`)
}

const goToCategory = (slug) => {
  router.push(`/catalog?category=${slug}`)
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  color: white;
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: rgba(255,255,255,0.8);
  margin-bottom: 24px;
}

.btn-hero {
  display: inline-block;
  padding: 12px 30px;
  background: white;
  color: #667eea;
  border-radius: 30px;
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

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.category-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
}

.category-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s;
}

.category-card:hover img {
  transform: scale(1.05);
}

.category-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
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
  color: var(--accent-primary);
  font-weight: 700;
  margin-bottom: 12px;
}

.add-to-cart {
  width: 100%;
  padding: 10px;
  background: var(--gradient-primary);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

@media (max-width: 768px) {
  .categories-grid, .products-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>