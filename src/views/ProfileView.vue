<template>
  <div class="profile-page">
    <!-- Hero секция -->
    <div class="profile-hero">
      <div class="profile-hero-content">
        <div class="profile-avatar-large">
          <div class="avatar-inner">
            <img :src="userAvatar" alt="Avatar">
            <button class="avatar-edit" @click="changeAvatar">
              <i class="bi bi-camera"></i>
            </button>
          </div>
        </div>
        <h1>{{ userName }}</h1>
        <p class="user-role" :class="userRoleClass">{{ userRoleText }}</p>
        <div class="user-stats">
          <div class="stat">
            <span class="stat-value">{{ orders.length }}</span>
            <span class="stat-label">Заказов</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ wishlist.length }}</span>
            <span class="stat-label">В избранном</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ bonusPoints }}</span>
            <span class="stat-label">Бонусов</span>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-container">
      <!-- Боковое меню -->
      <div class="profile-sidebar">
        <div class="sidebar-menu">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['menu-item', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <i :class="tab.icon"></i>
            <span>{{ tab.name }}</span>
          </button>
        </div>
      </div>

      <!-- Основной контент -->
      <div class="profile-content">
        <!-- Вкладка: Профиль -->
        <div v-if="activeTab === 'profile'" class="tab-content">
          <div class="card">
            <div class="card-header">
              <h3><i class="bi bi-person"></i> Личная информация</h3>
              <button class="btn-edit" @click="openEditModal">
                <i class="bi bi-pencil"></i> Редактировать
              </button>
            </div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item">
                  <label>Имя</label>
                  <p>{{ userData.name }}</p>
                </div>
                <div class="info-item">
                  <label>Email</label>
                  <p>{{ userData.email }}</p>
                </div>
                <div class="info-item">
                  <label>Телефон</label>
                  <p>{{ userData.phone || 'Не указан' }}</p>
                </div>
                <div class="info-item">
                  <label>Адрес</label>
                  <p>{{ userData.address || 'Не указан' }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3><i class="bi bi-shield-lock"></i> Безопасность</h3>
            </div>
            <div class="card-body">
              <button class="security-btn" @click="openPasswordModal">
                <i class="bi bi-key"></i> Изменить пароль
              </button>
            </div>
          </div>
        </div>

        <!-- Вкладка: Заказы -->
        <div v-if="activeTab === 'orders'" class="tab-content">
          <div class="card">
            <div class="card-header">
              <h3><i class="bi bi-box"></i> Мои заказы</h3>
            </div>
            <div class="card-body">
              <div v-if="orders.length === 0" class="empty-state">
                <i class="bi bi-inbox"></i>
                <p>У вас пока нет заказов</p>
                <router-link to="/catalog" class="btn-primary">Перейти в каталог</router-link>
              </div>
              <div v-else class="orders-list">
                <div v-for="order in orders" :key="order.id" class="order-card">
                  <div class="order-header">
                    <div>
                      <span class="order-number">Заказ #{{ order.number }}</span>
                      <span class="order-date">{{ order.date }}</span>
                    </div>
                    <span :class="['order-status', order.status]">{{ order.statusText }}</span>
                  </div>
                  <div class="order-items">
                    <div v-for="item in order.items" :key="item.id" class="order-item">
                      <div class="order-item-image">
                        <img :src="item.image" :alt="item.name">
                      </div>
                      <div class="order-item-info">
                        <h4>{{ item.name }}</h4>
                        <p>{{ item.quantity }} шт. × {{ formatPrice(item.price) }}</p>
                      </div>
                      <div class="order-item-price">{{ formatPrice(item.quantity * item.price) }}</div>
                    </div>
                  </div>
                  <div class="order-footer">
                    <div class="order-total">
                      <span>Итого:</span>
                      <strong>{{ formatPrice(order.total) }}</strong>
                    </div>
                    <button class="btn-repeat" @click="repeatOrder(order)">
                      <i class="bi bi-arrow-repeat"></i> Повторить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Вкладка: Избранное -->
        <div v-if="activeTab === 'wishlist'" class="tab-content">
          <div class="card">
            <div class="card-header">
              <h3><i class="bi bi-heart"></i> Избранное</h3>
            </div>
            <div class="card-body">
              <div v-if="wishlist.length === 0" class="empty-state">
                <i class="bi bi-heart"></i>
                <p>В избранном пока нет товаров</p>
                <router-link to="/catalog" class="btn-primary">Перейти в каталог</router-link>
              </div>
              <div v-else class="wishlist-grid">
                <div v-for="item in wishlist" :key="item.id" class="wishlist-item">
                  <div class="wishlist-image">
                    <img :src="item.image" :alt="item.name">
                    <button class="remove-wishlist" @click="removeFromWishlist(item.id)">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                  <div class="wishlist-info">
                    <h4>{{ item.name }}</h4>
                    <p class="wishlist-brand">{{ item.brand }}</p>
                    <div class="wishlist-price">{{ formatPrice(item.price) }}</div>
                    <button class="btn-add-cart" @click="addToCart(item)">
                      <i class="bi bi-cart-plus"></i> В корзину
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Вкладка: Настройки -->
        <div v-if="activeTab === 'settings'" class="tab-content">
          <div class="card">
            <div class="card-header">
              <h3><i class="bi bi-gear"></i> Настройки</h3>
            </div>
            <div class="card-body">
              <div class="settings-group">
                <h4>Уведомления</h4>
                <label class="setting-item">
                  <input type="checkbox" v-model="settings.email">
                  <span>Email-уведомления</span>
                </label>
                <label class="setting-item">
                  <input type="checkbox" v-model="settings.sms">
                  <span>SMS-уведомления</span>
                </label>
              </div>
              <button class="btn-save" @click="saveSettings">Сохранить настройки</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования профиля -->
    <div v-if="editModalOpen" class="modal-overlay" @click.self="editModalOpen = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Редактирование профиля</h3>
          <button class="modal-close" @click="editModalOpen = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Имя</label>
            <input type="text" v-model="editForm.name">
          </div>
          <div class="form-group">
            <label>Телефон</label>
            <input type="tel" v-model="editForm.phone">
          </div>
          <div class="form-group">
            <label>Адрес</label>
            <textarea v-model="editForm.address" rows="3"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="editModalOpen = false">Отмена</button>
          <button class="btn-save-modal" @click="saveProfile">Сохранить</button>
        </div>
      </div>
    </div>

    <!-- Модальное окно смены пароля -->
    <div v-if="passwordModalOpen" class="modal-overlay" @click.self="passwordModalOpen = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Смена пароля</h3>
          <button class="modal-close" @click="passwordModalOpen = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Новый пароль</label>
            <input type="password" v-model="passwordForm.new">
          </div>
          <div class="form-group">
            <label>Подтверждение</label>
            <input type="password" v-model="passwordForm.confirm">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="passwordModalOpen = false">Отмена</button>
          <button class="btn-save-modal" @click="changePassword">Сменить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { products } from '../data/products'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

if (!authStore.isAuthenticated) {
  router.push('/login')
}

// Данные текущего пользователя из authStore
const currentUser = authStore.user

const activeTab = ref('profile')
const editModalOpen = ref(false)
const passwordModalOpen = ref(false)

const tabs = ref([
  { id: 'profile', name: 'Профиль', icon: 'bi bi-person' },
  { id: 'orders', name: 'Заказы', icon: 'bi bi-box' },
  { id: 'wishlist', name: 'Избранное', icon: 'bi bi-heart' },
  { id: 'settings', name: 'Настройки', icon: 'bi bi-gear' }
])

// Загружаем данные пользователя
const userName = ref(currentUser?.firstName + ' ' + currentUser?.lastName || currentUser?.email || 'Пользователь')
const userAvatar = ref('https://randomuser.me/api/portraits/men/1.jpg')
const userRoleText = ref(authStore.isAdmin ? 'Администратор' : 'Покупатель')
const userRoleClass = ref(authStore.isAdmin ? 'role-admin' : 'role-user')
const bonusPoints = ref(1250)

const userData = ref({
  name: currentUser?.firstName + ' ' + currentUser?.lastName || currentUser?.email,
  email: currentUser?.email || 'user@example.com',
  phone: currentUser?.phone || '+7 (999) 123-45-67',
  address: currentUser?.address || 'г. Москва, ул. Музыкальная, д. 15'
})

const orders = ref([
  {
    id: 1,
    number: 'ORD-001',
    date: '15.05.2026',
    total: 89990,
    status: 'delivered',
    statusText: 'Доставлен',
    items: [
      { id: 1, name: 'Fender Stratocaster', quantity: 1, price: 89990, image: products[0]?.image || '' }
    ]
  }
])

const wishlist = ref(products.slice(0, 2))
const settings = ref({ email: true, sms: false })
const editForm = ref({ name: userData.value.name, phone: userData.value.phone, address: userData.value.address })
const passwordForm = ref({ new: '', confirm: '' })

const formatPrice = (price) => price?.toLocaleString('ru-RU') + ' ₽'

const changeAvatar = () => alert('🖼️ Загрузка аватара будет доступна позже')
const openEditModal = () => { editForm.value = { name: userData.value.name, phone: userData.value.phone, address: userData.value.address }; editModalOpen.value = true }
const saveProfile = () => { userData.value = { ...userData.value, ...editForm.value }; userName.value = editForm.value.name; editModalOpen.value = false; alert('✅ Профиль обновлён!') }
const openPasswordModal = () => { passwordModalOpen.value = true }
const changePassword = () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) { alert('❌ Пароли не совпадают'); return }
  if (passwordForm.value.new.length < 6) { alert('❌ Минимум 6 символов'); return }
  passwordModalOpen.value = false; alert('✅ Пароль изменён!')
}
const saveSettings = () => { alert('✅ Настройки сохранены!') }
const repeatOrder = (order) => { order.items.forEach(item => cartStore.addItem(item)); router.push('/cart') }
const addToCart = (item) => { cartStore.addItem(item); alert(`✅ ${item.name} добавлен в корзину!`) }
const removeFromWishlist = (id) => { wishlist.value = wishlist.value.filter(i => i.id !== id); alert('❤️ Товар удалён из избранного') }
</script>

<style scoped>
.profile-page {
  background: var(--bg-primary);
  min-height: calc(100vh - 80px);
}

.profile-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 50px 0;
  text-align: center;
}

.profile-hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.avatar-inner {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
}

.avatar-inner img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  border: none;
  color: white;
  cursor: pointer;
}

.profile-hero h1 {
  font-size: 1.8rem;
  color: white;
  margin: 15px 0 5px;
}

.user-role {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-bottom: 20px;
}

.role-admin {
  background: rgba(255, 51, 102, 0.2);
  color: #ff3366;
}

.role-user {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.user-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.stat-value {
  display: block;
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  display: flex;
  gap: 30px;
}

.profile-sidebar {
  width: 250px;
  flex-shrink: 0;
}

.sidebar-menu {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
}

.menu-item:hover {
  background: rgba(255, 51, 102, 0.1);
  color: var(--accent-primary);
}

.menu-item.active {
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  color: white;
}

.profile-content {
  flex: 1;
}

.card {
  background: var(--bg-card);
  border-radius: 16px;
  margin-bottom: 20px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header h3 {
  color: white;
  font-size: 1.1rem;
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
}

.info-item label {
  display: block;
  font-size: 0.7rem;
  color: var(--accent-primary);
  margin-bottom: 8px;
}

.info-item p {
  color: white;
  margin: 0;
}

.btn-edit {
  background: transparent;
  border: 1px solid var(--accent-primary);
  border-radius: 30px;
  padding: 6px 16px;
  color: var(--accent-primary);
  cursor: pointer;
}

.security-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: 10px 24px;
  color: white;
  cursor: pointer;
  margin-right: 12px;
}

.order-card {
  background: var(--bg-elevated);
  border-radius: 12px;
  margin-bottom: 15px;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
}

.order-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
}

.order-status.delivered {
  background: rgba(68, 204, 68, 0.2);
  color: #44cc44;
}

.order-items {
  padding: 12px 16px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.order-item-image {
  width: 50px;
  height: 50px;
}

.order-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.order-item-info {
  flex: 1;
}

.order-item-info h4 {
  color: white;
  margin: 0 0 4px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.btn-repeat {
  background: transparent;
  border: 1px solid var(--accent-primary);
  border-radius: 20px;
  padding: 6px 16px;
  color: var(--accent-primary);
  cursor: pointer;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.wishlist-item {
  background: var(--bg-elevated);
  border-radius: 12px;
  overflow: hidden;
}

.wishlist-image {
  position: relative;
  aspect-ratio: 1;
}

.wishlist-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-wishlist {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  cursor: pointer;
}

.wishlist-info {
  padding: 12px;
}

.wishlist-info h4 {
  color: white;
  margin: 0 0 4px;
}

.wishlist-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent-primary);
  margin: 8px 0;
}

.btn-add-cart {
  width: 100%;
  padding: 8px;
  background: transparent;
  border: 1px solid var(--accent-primary);
  border-radius: 8px;
  color: var(--accent-primary);
  cursor: pointer;
}

.settings-group {
  margin-bottom: 20px;
}

.settings-group h4 {
  color: white;
  margin-bottom: 12px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  color: var(--text-secondary);
  cursor: pointer;
}

.btn-save {
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  border: none;
  border-radius: 30px;
  padding: 10px 24px;
  color: white;
  cursor: pointer;
  margin-top: 16px;
}

.empty-state {
  text-align: center;
  padding: 40px;
}

.empty-state i {
  font-size: 3rem;
  color: var(--text-muted);
}

.btn-primary {
  display: inline-block;
  margin-top: 12px;
  padding: 8px 20px;
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  border-radius: 25px;
  color: white;
  text-decoration: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--bg-card);
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  color: white;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: var(--text-secondary);
}

.form-group input, .form-group textarea {
  width: 100%;
  padding: 10px;
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
}

.btn-cancel, .btn-save-modal {
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-cancel {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-save-modal {
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  border: none;
  color: white;
}

@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }
  
  .profile-sidebar {
    width: 100%;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .user-stats {
    gap: 20px;
  }
}
</style>