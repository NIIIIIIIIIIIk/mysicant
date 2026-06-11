<template>
  <div class="admin-page">
    <div class="admin-header">
      <h1><i class="bi bi-shield-lock"></i> Админ-панель</h1>
      <p>Управление интернет-магазином</p>
    </div>

    <div class="admin-container">
      <div class="admin-sidebar">
        <button 
          v-for="item in menuItems" 
          :key="item.id"
          :class="['admin-menu-item', { active: activeSection === item.id }]"
          @click="activeSection = item.id"
        >
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
        </button>
      </div>

      <div class="admin-content">
        <!-- Управление заказами -->
        <div v-if="activeSection === 'orders'" class="orders-manager">
          <div class="section-header">
            <h2>Управление заказами</h2>
            <select v-model="orderFilter" class="filter-select">
              <option value="all">Все заказы</option>
              <option value="pending">Ожидают подтверждения</option>
              <option value="confirmed">Подтверждённые</option>
              <option value="delivered">Доставленные</option>
            </select>
          </div>

          <table class="admin-table">
            <thead>
              <tr><th>№</th><th>Дата</th><th>Клиент</th><th>Сумма</th><th>Статус</th><th>Действия</th></tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id">
                <td>{{ order.orderNumber }}</td>
                <td>{{ order.date }}</td>
                <td>{{ order.customerName }}</td>
                <td>{{ formatPrice(order.totalAmount) }}</td>
                <td><span :class="['status-badge', order.status]">{{ order.statusText }}</span></td>
                <td>
                  <div class="action-buttons">
                    <button 
                      v-if="order.status === 'pending'"
                      class="btn-confirm" 
                      @click="confirmOrder(order.id)"
                    >
                      <i class="bi bi-check-lg"></i> Подтвердить
                    </button>
                    <button 
                      v-if="order.status === 'confirmed'"
                      class="btn-deliver" 
                      @click="deliverOrder(order.id)"
                    >
                      <i class="bi bi-truck"></i> Доставлено
                    </button>
                    <button class="btn-view" @click="viewOrder(order)"><i class="bi bi-eye"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Статистика -->
        <div v-if="activeSection === 'dashboard'" class="dashboard">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon"><i class="bi bi-cart"></i></div>
              <div class="stat-info">
                <h3>{{ stats.orders }}</h3>
                <p>Всего заказов</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon"><i class="bi bi-clock-history"></i></div>
              <div class="stat-info">
                <h3>{{ stats.pending }}</h3>
                <p>Ожидают подтверждения</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon"><i class="bi bi-truck"></i></div>
              <div class="stat-info">
                <h3>{{ stats.delivered }}</h3>
                <p>Доставлено</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно деталей заказа -->
    <div v-if="orderModalOpen" class="modal-overlay" @click.self="orderModalOpen = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Детали заказа #{{ selectedOrder?.orderNumber }}</h3>
          <button class="modal-close" @click="orderModalOpen = false">×</button>
        </div>
        <div class="modal-body">
          <p><strong>Клиент:</strong> {{ selectedOrder?.customerName }}</p>
          <p><strong>Телефон:</strong> {{ selectedOrder?.customerPhone }}</p>
          <p><strong>Email:</strong> {{ selectedOrder?.customerEmail }}</p>
          <p><strong>Адрес:</strong> {{ selectedOrder?.deliveryAddress }}</p>
          <p><strong>Дата:</strong> {{ selectedOrder?.date }}</p>
          <p><strong>Статус:</strong> {{ selectedOrder?.statusText }}</p>
          <h4>Товары:</h4>
          <ul><li v-for="item in selectedOrder?.items" :key="item.id">{{ item.name }} — {{ item.quantity }} шт. × {{ formatPrice(item.price) }}</li></ul>
          <p class="order-total"><strong>Итого:</strong> {{ formatPrice(selectedOrder?.totalAmount) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useOrdersStore } from '../stores/orders'
import { showNotification } from '../utils/notifications'

const router = useRouter()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()

const activeSection = ref('dashboard')
const orderModalOpen = ref(false)
const selectedOrder = ref(null)
const orderFilter = ref('all')

const menuItems = ref([
  { id: 'dashboard', name: 'Статистика', icon: 'bi bi-speedometer2' },
  { id: 'orders', name: 'Заказы', icon: 'bi bi-cart' }
])

const orders = computed(() => ordersStore.getAllOrders)
const filteredOrders = computed(() => {
  if (orderFilter.value === 'all') return orders.value
  return orders.value.filter(o => o.status === orderFilter.value)
})

const stats = computed(() => ({
  orders: orders.value.length,
  pending: orders.value.filter(o => o.status === 'pending').length,
  delivered: orders.value.filter(o => o.status === 'delivered').length
}))

const formatPrice = (price) => price?.toLocaleString('ru-RU') + ' ₽'

const confirmOrder = (orderId) => {
  ordersStore.updateOrderStatus(orderId, 'confirmed')
  showNotification('Заказ подтверждён', 'success')
}

const deliverOrder = (orderId) => {
  ordersStore.updateOrderStatus(orderId, 'delivered')
  showNotification('Заказ отмечен как доставленный', 'success')
}

const viewOrder = (order) => {
  selectedOrder.value = order
  orderModalOpen.value = true
}

onMounted(() => {
  if (!authStore.isAdmin) router.push('/')
  ordersStore.loadFromLocalStorage()
})
</script>

<style scoped>
.admin-page {
  background: var(--bg-primary);
  min-height: calc(100vh - 80px);
}

.admin-header {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  padding: 30px 20px;
  text-align: center;
}

.admin-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
  gap: 30px;
}

.admin-sidebar {
  width: 260px;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 12px;
}

.admin-menu-item {
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

.admin-menu-item.active {
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  color: white;
}

.admin-content {
  flex: 1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: rgba(255,51,102,0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #ff3366;
}

.admin-table {
  width: 100%;
  background: var(--bg-card);
  border-radius: 16px;
  overflow-x: auto;
}

.admin-table th, .admin-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
}

.status-badge.pending {
  background: rgba(255,204,0,0.2);
  color: #ffcc00;
}

.status-badge.confirmed {
  background: rgba(68,204,68,0.2);
  color: #44cc44;
}

.status-badge.delivered {
  background: rgba(68,204,68,0.2);
  color: #44cc44;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-confirm, .btn-deliver, .btn-view {
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
}

.btn-confirm {
  background: #44cc44;
  color: white;
}

.btn-deliver {
  background: #ffcc00;
  color: black;
}

.btn-view {
  background: rgba(255,255,255,0.1);
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
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
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
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

@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
  .admin-sidebar {
    width: 100%;
  }
}
</style>
