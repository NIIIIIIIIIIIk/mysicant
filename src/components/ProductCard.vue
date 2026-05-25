<template>
  <div class="product-card">
    <div class="product-image">
      <img :src="product.image" :alt="product.name" loading="lazy">
      <div class="image-overlay">
        <button class="quick-view" @click="$emit('quick-view', product)">
          <i class="bi bi-eye"></i>
        </button>
      </div>
      <span v-if="product.badge" :class="['badge', product.badgeClass]">
        {{ product.badge }}
      </span>
      <button class="wishlist-btn" @click="$emit('wishlist', product)">
        <i :class="isWishlist ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
      </button>
    </div>
    <div class="product-info">
      <div class="brand">{{ product.brand }}</div>
      <h3 class="name">{{ product.name }}</h3>
      <div class="price">
        <span class="current">{{ formatPrice(product.price) }}</span>
        <span v-if="product.oldPrice" class="old">{{ formatPrice(product.oldPrice) }}</span>
      </div>
      <div class="rating">
        <div class="stars">
          <i v-for="n in 5" :key="n" :class="['bi', n <= product.rating ? 'bi-star-fill' : 'bi-star']"></i>
        </div>
        <span>({{ product.reviews }})</span>
      </div>
      <button class="add-to-cart" @click="$emit('add-to-cart', product)">
        <i class="bi bi-cart-plus"></i> В корзину
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: Object,
  isWishlist: Boolean
})

defineEmits(['add-to-cart', 'wishlist', 'quick-view'])

const formatPrice = (price) => {
  return price?.toLocaleString('ru-RU') + ' ₽'
}
</script>

<style scoped>
.product-card {
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
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
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .image-overlay {
  opacity: 1;
}

.quick-view {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-view:hover {
  background: var(--accent-primary);
  color: white;
  transform: scale(1.1);
}

.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
}

.badge.hot {
  background: linear-gradient(135deg, #ff4444, #ff6666);
  color: white;
}

.badge.new {
  background: linear-gradient(135deg, #44cc44, #66ff66);
  color: white;
}

.badge.sale {
  background: linear-gradient(135deg, #ffcc00, #ffdd44);
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
  transform: scale(1.1);
}

.wishlist-btn .bi-heart-fill {
  color: #ff4444;
}

.product-info {
  padding: 16px;
}

.brand {
  font-size: 0.7rem;
  color: var(--accent-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.name {
  font-size: 1rem;
  color: white;
  margin: 8px 0;
  font-weight: 600;
}

.price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0;
}

.current {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent-primary);
}

.old {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-decoration: line-through;
}

.rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}

.stars {
  color: #ffc107;
  font-size: 0.8rem;
}

.rating span {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.add-to-cart {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, transparent, var(--bg-elevated));
  border: 1px solid rgba(255, 51, 102, 0.3);
  border-radius: 10px;
  color: var(--accent-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart:hover {
  background: var(--gradient-primary);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
}
</style>