<template>
  <div class="catalog-page">
    <div class="catalog-header">
      <h1>🎸 Каталог музыкальных инструментов</h1>
      <p>{{ filteredProducts.length }} товаров</p>
    </div>

    <!-- Фильтры -->
    <div class="filters-bar">
      <div class="filters-container">
        <div class="filter-group">
          <label>Категория</label>
          <select v-model="filters.category" class="filter-select">
            <option value="">Все</option>
            <option value="guitar">🎸 Гитары</option>
            <option value="piano">🎹 Клавишные</option>
            <option value="drums">🥁 Ударные</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Бренд</label>
          <select v-model="filters.brand" class="filter-select">
            <option value="">Все</option>
            <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Цена</label>
          <div class="price-range">
            <input type="number" v-model="filters.minPrice" placeholder="от" class="price-input">
            <span>-</span>
            <input type="number" v-model="filters.maxPrice" placeholder="до" class="price-input">
          </div>
        </div>

        <div class="filter-group">
          <label>Сортировка</label>
          <select v-model="sortBy" class="filter-select">
            <option value="newest">Новинки</option>
            <option value="price_asc">Цена по возрастанию</option>
            <option value="price_desc">Цена по убыванию</option>
            <option value="name_asc">Название А-Я</option>
          </select>
        </div>

        <button class="reset-filters" @click="resetFilters">Сбросить</button>
      </div>
    </div>

    <!-- Список товаров -->
    <div class="products-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <div class="product-image">
          <img :src="product.image" :alt="product.name">
          <span v-if="product.badge" :class="['product-badge', product.badgeClass]">{{ product.badge }}</span>
          <button class="wishlist-btn" @click="toggleWishlist(product)">
            <i :class="isInWishlist(product.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
          </button>
        </div>
        <div class="product-info">
          <div class="product-brand">{{ product.brand }}</div>
          <h3 class="product-name">{{ product.name }}</h3>
          <div class="product-price">
            <span class="current-price">{{ formatPrice(product.price) }}</span>
            <span v-if="product.oldPrice" class="old-price">{{ formatPrice(product.oldPrice) }}</span>
          </div>
          <div class="product-rating">
            <div class="stars">
              <i v-for="n in 5" :key="n" :class="['bi', n <= product.rating ? 'bi-star-fill' : 'bi-star']"></i>
            </div>
            <span>({{ product.reviews }})</span>
          </div>
          <button class="add-to-cart-btn" @click="addToCart(product)">
            <i class="bi bi-cart-plus"></i> В корзину
          </button>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div v-if="filteredProducts.length === 0" class="empty-state">
      <i class="bi bi-emoji-frown"></i>
      <h3>Товары не найдены</h3>
      <p>Попробуйте изменить параметры фильтрации</p>
      <button class="reset-filters-btn" @click="resetFilters">Сбросить фильтры</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { products as productsData } from '../data/products'

const cartStore = useCartStore()

// Товары из файла с данными
const products = ref(productsData)

// Фильтры
const filters = ref({
  category: '',
  brand: '',
  minPrice: '',
  maxPrice: ''
})
const sortBy = ref('newest')

// Список брендов
const brands = computed(() => {
  const unique = [...new Set(products.value.map(p => p.brand))]
  return unique.sort()
})

// Избранное
const wishlist = ref([])

// Фильтрация товаров
const filteredProducts = computed(() => {
  let result = [...products.value]

  if (filters.value.category) {
    result = result.filter(p => p.category === filters.value.category)
  }
  if (filters.value.brand) {
    result = result.filter(p => p.brand === filters.value.brand)
  }
  if (filters.value.minPrice) {
    result = result.filter(p => p.price >= Number(filters.value.minPrice))
  }
  if (filters.value.maxPrice) {
    result = result.filter(p => p.price <= Number(filters.value.maxPrice))
  }

  switch (sortBy.value) {
    case 'price_asc': result.sort((a, b) => a.price - b.price); break
    case 'price_desc': result.sort((a, b) => b.price - a.price); break
    case 'name_asc': result.sort((a, b) => a.name.localeCompare(b.name)); break
    default: result.sort((a, b) => b.id - a.id)
  }
  return result
})

const formatPrice = (price) => {
  return price.toLocaleString('ru-RU') + ' ₽'
}

const addToCart = (product) => {
  cartStore.addItem(product)
  alert(`✅ ${product.name} добавлен в корзину!`)
}

const toggleWishlist = (product) => {
  const index = wishlist.value.findIndex(i => i.id === product.id)
  if (index === -1) {
    wishlist.value.push(product)
    alert(`❤️ ${product.name} добавлен в избранное!`)
  } else {
    wishlist.value.splice(index, 1)
    alert(`💔 ${product.name} удалён из избранного!`)
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist.value))
}

const isInWishlist = (productId) => {
  return wishlist.value.some(i => i.id === productId)
}

const resetFilters = () => {
  filters.value = { category: '', brand: '', minPrice: '', maxPrice: '' }
  sortBy.value = 'newest'
}

onMounted(() => {
  const savedWishlist = localStorage.getItem('wishlist')
  if (savedWishlist) {
    wishlist.value = JSON.parse(savedWishlist)
  }
})
</script>

<style scoped>
.catalog-page {
  padding: 30px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.catalog-header {
  text-align: center;
  margin-bottom: 30px;
}

.catalog-header h1 {
  font-size: 2rem;
  color: white;
  margin-bottom: 8px;
}

.catalog-header p {
  color: var(--text-secondary);
}

.filters-bar {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 30px;
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.filter-select {
  padding: 8px 12px;
  background: var(--bg-elevated);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: white;
  min-width: 130px;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-input {
  width: 90px;
  padding: 8px;
  background: var(--bg-elevated);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: white;
}

.reset-filters {
  padding: 8px 20px;
  background: transparent;
  border: 1px solid var(--accent-primary);
  border-radius: 8px;
  color: var(--accent-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.reset-filters:hover {
  background: var(--accent-primary);
  color: white;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.product-card {
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.product-badge.hot {
  background: #ff4444;
  color: white;
}

.product-badge.new {
  background: #44cc44;
  color: white;
}

.product-badge.sale {
  background: #ffcc00;
  color: black;
}

.wishlist-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.wishlist-btn:hover {
  background: var(--accent-primary);
}

.wishlist-btn .bi-heart-fill {
  color: #ff4444;
}

.product-info {
  padding: 16px;
}

.product-brand {
  font-size: 0.75rem;
  color: var(--accent-primary);
  text-transform: uppercase;
}

.product-name {
  font-size: 1rem;
  color: white;
  margin: 5px 0;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.current-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent-primary);
}

.old-price {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-decoration: line-through;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 12px;
}

.stars {
  color: #ffc107;
  font-size: 0.8rem;
}

.product-rating span {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.add-to-cart-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, transparent, var(--bg-elevated));
  border: 1px solid rgba(255,51,102,0.3);
  border-radius: 10px;
  color: var(--accent-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart-btn:hover {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
}

.empty-state {
  text-align: center;
  padding: 60px;
  background: var(--bg-card);
  border-radius: 16px;
}

.empty-state i {
  font-size: 4rem;
  color: var(--text-muted);
}

.empty-state h3 {
  color: white;
  margin: 15px 0;
}

.reset-filters-btn {
  margin-top: 15px;
  padding: 10px 25px;
  background: var(--gradient-primary);
  border: none;
  border-radius: 25px;
  color: white;
  cursor: pointer;
}

@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
  }
  .filter-group {
    width: 100%;
  }
  .filter-select, .price-input {
    width: 100%;
  }
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}
</style>