<template>
  <div class="profile-page">
    <div class="profile-hero">
      <div class="profile-hero-content">
        <div class="profile-avatar-large">
          <div class="avatar-inner">
            <img :src="userAvatar" alt="Avatar">
          </div>
        </div>
        <h1>{{ userName }}</h1>
        <p class="user-role">{{ userRoleText }}</p>
      </div>
    </div>

    <div class="profile-container">
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

      <div class="profile-content">
        <!-- Заказы пользователя -->
        <div v-if="activeTab === 'orders'" class="tab-content">
          <div class="card">
            <div class="card-header">
              <h3><i class="bi bi-box"></i> Мои заказы</h3>
            </div>
            <div class="card-body">
              <div v-if="userOrders.length === 0" class="empty-state">
                <i class="bi bi-inbox"></i>
                <p>У вас пока нет заказов</p>
                <router-link to="/catalog" class="btn-primary">Перейти в каталог</router-link>
              </div>
              <div v-else class="orders-list">
                <div v-for="order in userOrders" :key="order.id" class="order-card">
                  <div class="order-header">
                    <div>
                      <span class="order-number">Заказ #{{ order.orderNumber }}</span>
                      <span class="order-date">{{ order.date }}</span>
                    </div>
                    <span :class="['order-status', order.status]">{{ order.statusText }}</span>
                  </div>
                  <div class="order-items">
                    <div v-for="item in order.items" :key="item.id" class="order-item">
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
                      <strong>{{ formatPrice(order.totalAmount) }}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Профиль -->
        <div v-if="activeTab === 'profile'" class="tab-content">
          <div class="card">
            <div class="card-header">
              <h3><i class="bi bi-person"></i> Личная информация</h3>
              <button class="btn-edit" @click="openEditModal"><i class="bi bi-pencil"></i> Редактировать</button>
            </div>
            <div class="card-body">
              <div class="info-grid">
                <div class="info-item"><label>Имя</label><p>{{ userData.name }}</p></div>
                <div class="info-item"><label>Email</label><p>{{ userData.email }}</p></div>
                <div class="info-item"><label>Телефон</label><p>{{ userData.phone || 'Не указан' }}</p></div>
                <div class="info-item"><label>Адрес</label><p>{{ userData.address || 'Не указан' }}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'

const authStore = useAuthStore()
const ordersStore = useOrdersStore()

const activeTab = ref('profile')
const userName = ref(authStore.userName)
const userAvatar = ref('https://randomuser.me/api/portraits/men/1.jpg')
const userRoleText = ref(authStore.isAdmin ? 'Администратор' : 'Покупатель')

const userData = ref({
  name: authStore.user?.name || 'Пользователь',
  email: authStore.user?.email || 'user@example.com',
  phone: authStore.user?.phone || '+7 (999) 123-45-67',
  address: authStore.user?.address || 'г. Москва, ул. Музыкальная, д. 15'
})

const tabs = ref([
  { id: 'profile', name: 'Профиль', icon: 'bi bi-person' },
  { id: 'orders', name: 'Заказы', icon: 'bi bi-box' }
])

const userOrders = computed(() => ordersStore.getUserOrders(authStore.user?.id || 0))

const formatPrice = (price) => price?.toLocaleString('ru-RU') + ' ₽'

const openEditModal = () => { alert('Редактирование профиля будет доступно позже') }

onMounted(() => {
  ordersStore.loadFromLocalStorage()
})
</script>

<style scoped>
.profile-page {
  background: var(--bg-primary);
  min-height: calc(100vh - 80px);
}

.profile-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 0;
  text-align: center;
}

.avatar-inner {
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

.profile-hero h1 {
  font-size: 1.8rem;
  color: white;
  margin-top: 15px;
}

.user-role {
  display: inline-block;
  padding: 4px 16px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  color: white;
  font-size: 0.8rem;
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
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.card-header h3 {
  color: white;
  margin: 0;
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
  background: rgba(0,0,0,0.2);
}

.order-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
}

.order-status.pending {
  background: rgba(255,204,0,0.2);
  color: #ffcc00;
}

.order-status.confirmed {
  background: rgba(68,204,68,0.2);
  color: #44cc44;
}

.order-status.delivered {
  background: rgba(68,204,68,0.2);
  color: #44cc44;
}

.order-items {
  padding: 12px 16px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.order-item-info h4 {
  color: white;
  margin: 0 0 4px;
  font-size: 0.9rem;
}

.order-item-info p {
  color: var(--text-muted);
  margin: 0;
  font-size: 0.75rem;
}

.order-footer {
  padding: 12px 16px;
  border-top: 1px solid rgba(255,255,255,0.05);
  text-align: right;
}

.order-total strong {
  color: #ff3366;
  margin-left: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px;
}

.btn-primary {
  display: inline-block;
  padding: 8px 20px;
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  border-radius: 25px;
  color: white;
  text-decoration: none;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item label {
  display: block;
  font-size: 0.7rem;
  color: #ff3366;
  margin-bottom: 4px;
}

.info-item p {
  color: white;
  margin: 0;
}

.btn-edit {
  background: transparent;
  border: 1px solid #ff3366;
  border-radius: 30px;
  padding: 6px 16px;
  color: #ff3366;
  cursor: pointer;
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
}
</style>
