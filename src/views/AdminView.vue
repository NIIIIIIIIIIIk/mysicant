<template>
  <div class="admin-page">
    <div class="admin-header">
      <h1><i class="bi bi-shield-lock"></i> Админ-панель</h1>
      <p>Управление интернет-магазином музыкальных инструментов</p>
    </div>

    <div class="admin-container">
      <!-- Боковое меню -->
      <div class="admin-sidebar">
        <button 
          v-for="item in menuItems" 
          :key="item.id"
          :class="['admin-menu-item', { active: activeSection === item.id }]"
          @click="activeSection = item.id"
        >
          <i :class="item.icon"></i>
          <span>{{ item.name }}</span>
          <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
        </button>
      </div>

      <!-- Основной контент -->
      <div class="admin-content">
        <!-- ========== СТАТИСТИКА ========== -->
        <div v-if="activeSection === 'dashboard'" class="dashboard">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon"><i class="bi bi-box"></i></div>
              <div class="stat-info">
                <h3>{{ stats.products }}</h3>
                <p>Товаров</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon"><i class="bi bi-cart"></i></div>
              <div class="stat-info">
                <h3>{{ stats.orders }}</h3>
                <p>Заказов</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon"><i class="bi bi-people"></i></div>
              <div class="stat-info">
                <h3>{{ stats.users }}</h3>
                <p>Пользователей</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon"><i class="bi bi-currency-ruble"></i></div>
              <div class="stat-info">
                <h3>{{ formatPrice(stats.revenue) }}</h3>
                <p>Выручка</p>
              </div>
            </div>
          </div>

          <div class="recent-orders">
            <h3>Последние заказы</h3>
            <table class="admin-table">
              <thead>
                <tr><th>№</th><th>Дата</th><th>Клиент</th><th>Сумма</th><th>Статус</th></tr>
              </thead>
              <tbody>
                <tr v-for="order in recentOrders" :key="order.id">
                  <td>{{ order.number }}</td>
                  <td>{{ order.date }}</td>
                  <td>{{ order.customer }}</td>
                  <td>{{ formatPrice(order.total) }}</td>
                  <td><span :class="['status-badge', order.status]">{{ order.statusText }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ========== ТОВАРЫ ========== -->
        <div v-if="activeSection === 'products'" class="products-manager">
          <div class="section-header">
            <h2>Управление товарами</h2>
            <!-- СТИЛИЗОВАННАЯ КНОПКА ДОБАВЛЕНИЯ ТОВАРА -->
            <button class="btn-add-product" @click="openProductModal()">
              <i class="bi bi-plus-lg"></i>
              <span>Добавить товар</span>
            </button>
          </div>
          <table class="admin-table">
            <thead>
              <tr><th>ID</th><th>Фото</th><th>Название</th><th>Бренд</th><th>Цена</th><th>Действия</th></tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.id }}</td>
                <td><img :src="product.image" class="product-thumb" alt=""></td>
                <td>{{ product.name }}</td>
                <td>{{ product.brand }}</td>
                <td>{{ formatPrice(product.price) }}</td>
                <td>
                  <button class="btn-edit" @click="openProductModal(product)"><i class="bi bi-pencil"></i></button>
                  <button class="btn-delete" @click="deleteProduct(product.id)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ========== ЗАКАЗЫ ========== -->
        <div v-if="activeSection === 'orders'" class="orders-manager">
          <div class="section-header">
            <h2>Управление заказами</h2>
            <select v-model="orderFilter" class="filter-select">
              <option value="all">Все</option>
              <option value="new">Новые</option>
              <option value="processing">В обработке</option>
              <option value="delivered">Доставленные</option>
            </select>
          </div>
          <table class="admin-table">
            <thead>
              <tr><th>№</th><th>Дата</th><th>Клиент</th><th>Сумма</th><th>Статус</th><th>Действия</th></tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id">
                <td>{{ order.number }}</td>
                <td>{{ order.date }}</td>
                <td>{{ order.customer }}</td>
                <td>{{ formatPrice(order.total) }}</td>
                <td>
                  <select :value="order.status" @change="updateOrderStatus(order.id, $event.target.value)" class="status-select">
                    <option value="new">🆕 Новый</option>
                    <option value="processing">⚙️ В обработке</option>
                    <option value="delivered">✅ Доставлен</option>
                    <option value="cancelled">❌ Отменён</option>
                  </select>
                </td>
                <td><button class="btn-view" @click="viewOrder(order)"><i class="bi bi-eye"></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ========== ПОЛЬЗОВАТЕЛИ ========== -->
        <div v-if="activeSection === 'users'" class="users-manager">
          <div class="section-header">
            <h2>Управление пользователями</h2>
            <input type="text" v-model="userSearch" placeholder="🔍 Поиск по имени или email" class="search-input">
          </div>

          <div class="users-stats">
            <div class="user-stat-item">👥 Всего: {{ filteredUsers.length }}</div>
            <div class="user-stat-item">👑 Администраторов: {{ users.filter(u => u.role === 'admin').length }}</div>
            <div class="user-stat-item">🛒 Покупателей: {{ users.filter(u => u.role === 'user').length }}</div>
          </div>

          <div class="users-grid">
            <div v-for="user in filteredUsers" :key="user.id" class="user-card">
              <div class="user-card-header">
                <div class="user-avatar"><i class="bi bi-person-circle"></i></div>
                <div class="user-basic">
                  <h4>{{ user.name }}</h4>
                  <p class="user-email">{{ user.email }}</p>
                </div>
                <select :value="user.role" @change="updateUserRole(user.id, $event.target.value)" class="role-select">
                  <option value="user">👤 Пользователь</option>
                  <option value="admin">👑 Администратор</option>
                </select>
              </div>
              <div class="user-card-body">
                <div class="user-info-row">
                  <div class="user-info-item"><i class="bi bi-telephone"></i><span>{{ user.phone || 'Не указан' }}</span></div>
                  <div class="user-info-item"><i class="bi bi-geo-alt"></i><span>{{ user.address || 'Не указан' }}</span></div>
                  <div class="user-info-item"><i class="bi bi-calendar"></i><span>Регистрация: {{ user.registered || '15.05.2026' }}</span></div>
                </div>
                <div class="user-stats-detail">
                  <div class="detail-stat"><span class="stat-number">{{ getUserOrdersCount(user.id) }}</span><span class="stat-desc">Заказов</span></div>
                  <div class="detail-stat"><span class="stat-number">{{ getUserOrderTotal(user.id) }}</span><span class="stat-desc">Сумма заказов</span></div>
                  <div class="detail-stat"><span class="stat-number">{{ getUserWishlistCount(user.id) }}</span><span class="stat-desc">В избранном</span></div>
                </div>
              </div>
              <div class="user-card-footer">
                <button class="btn-delete" @click="deleteUser(user.id)"><i class="bi bi-trash"></i> Удалить</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно товара -->
    <div v-if="productModalOpen" class="modal-overlay" @click.self="productModalOpen = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingProduct ? 'Редактировать товар' : 'Добавить товар' }}</h3>
          <button class="modal-close" @click="productModalOpen = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group"><label>Название</label><input type="text" v-model="productForm.name"></div>
          <div class="form-group"><label>Бренд</label><input type="text" v-model="productForm.brand"></div>
          <div class="form-group"><label>Цена</label><input type="number" v-model="productForm.price"></div>
          <div class="form-group"><label>URL фото</label><input type="text" v-model="productForm.image"></div>
          <div class="form-group"><label>Описание</label><textarea v-model="productForm.description" rows="3"></textarea></div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="productModalOpen = false">Отмена</button>
          <button class="btn-save" @click="saveProduct">Сохранить</button>
        </div>
      </div>
    </div>

    <!-- Модальное окно деталей заказа -->
    <div v-if="orderModalOpen" class="modal-overlay" @click.self="orderModalOpen = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Детали заказа #{{ selectedOrder?.number }}</h3>
          <button class="modal-close" @click="orderModalOpen = false">×</button>
        </div>
        <div class="modal-body">
          <p><strong>Клиент:</strong> {{ selectedOrder?.customer }}</p>
          <p><strong>Адрес:</strong> {{ selectedOrder?.address || 'Не указан' }}</p>
          <p><strong>Телефон:</strong> {{ selectedOrder?.phone || 'Не указан' }}</p>
          <h4>Товары:</h4>
          <ul><li v-for="item in selectedOrder?.items" :key="item.id">{{ item.name }} — {{ item.quantity }} шт. × {{ formatPrice(item.price) }}</li></ul>
          <p><strong>Итого:</strong> {{ formatPrice(selectedOrder?.total) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { products as productsData } from '../data/products'
import { showNotification } from '../utils/notifications'

const router = useRouter()
const authStore = useAuthStore()

// Проверка прав доступа
onMounted(() => {
  if (!authStore.isAdmin) {
    router.push('/profile')
  }
})

// Активная секция
const activeSection = ref('dashboard')

// Меню
const menuItems = ref([
  { id: 'dashboard', name: 'Статистика', icon: 'bi bi-speedometer2' },
  { id: 'products', name: 'Товары', icon: 'bi bi-box', badge: productsData.length.toString() },
  { id: 'orders', name: 'Заказы', icon: 'bi bi-cart', badge: '5' },
  { id: 'users', name: 'Пользователи', icon: 'bi bi-people', badge: '4' }
])

// Статистика
const stats = ref({
  products: productsData.length,
  orders: 5,
  users: 4,
  revenue: 389960
})

// Товары
const products = ref([...productsData])

// Заказы
const orders = ref([
  { id: 1, number: 'ORD-001', date: '15.05.2026', customer: 'Алексей Петров', customerId: 1, total: 89990, status: 'delivered', statusText: 'Доставлен', address: 'Москва, ул. Музыкальная, 15', phone: '+7 (999) 123-45-67', items: [{ id: 1, name: 'Fender Stratocaster', quantity: 1, price: 89990 }] },
  { id: 2, number: 'ORD-002', date: '14.05.2026', customer: 'Иван Иванов', customerId: 2, total: 24990, status: 'new', statusText: 'Новый', address: 'СПб, Невский пр., 10', phone: '+7 (999) 234-56-78', items: [{ id: 2, name: 'Yamaha FG800', quantity: 1, price: 24990 }] }
])
const orderFilter = ref('all')
const filteredOrders = computed(() => {
  if (orderFilter.value === 'all') return orders.value
  return orders.value.filter(o => o.status === orderFilter.value)
})

// Пользователи
const users = ref([
  { id: 1, name: 'Алексей Петров', email: 'alex@example.com', phone: '+7 (999) 123-45-67', address: 'г. Москва, ул. Музыкальная, д. 15', role: 'user', registered: '15.05.2026', wishlist: [1, 3] },
  { id: 2, name: 'Иван Иванов', email: 'ivan@example.com', phone: '+7 (999) 234-56-78', address: 'г. Санкт-Петербург, Невский пр., д. 10', role: 'user', registered: '10.05.2026', wishlist: [2] },
  { id: 3, name: 'Администратор', email: 'admin@musicstore.ru', phone: '+7 (999) 345-67-89', address: 'г. Москва, ул. Админская, д. 1', role: 'admin', registered: '01.01.2026', wishlist: [] },
  { id: 4, name: 'Екатерина Смирнова', email: 'katya@example.com', phone: '+7 (999) 456-78-90', address: 'г. Казань, ул. Центральная, д. 5', role: 'user', registered: '20.05.2026', wishlist: [4, 5] }
])

const userSearch = ref('')
const filteredUsers = computed(() => {
  if (!userSearch.value) return users.value
  const search = userSearch.value.toLowerCase()
  return users.value.filter(u => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search))
})

const recentOrders = computed(() => orders.value.slice(0, 5))

const formatPrice = (price) => price?.toLocaleString('ru-RU') + ' ₽'

const getUserOrders = (userId) => orders.value.filter(o => o.customerId === userId)
const getUserOrdersCount = (userId) => getUserOrders(userId).length
const getUserOrderTotal = (userId) => getUserOrders(userId).reduce((sum, o) => sum + o.total, 0).toLocaleString('ru-RU') + ' ₽'
const getUserWishlistCount = (userId) => users.value.find(u => u.id === userId)?.wishlist?.length || 0

const updateUserRole = (id, role) => {
  const user = users.value.find(u => u.id === id)
  if (user) { 
    user.role = role
    showNotification(`Роль пользователя ${user.name} изменена`, 'success')
  }
}
const deleteUser = (id) => { 
  if (confirm('Удалить пользователя?')) {
    users.value = users.value.filter(u => u.id !== id)
    showNotification('Пользователь удалён', 'success')
  }
}

const updateOrderStatus = (id, status) => {
  const order = orders.value.find(o => o.id === id)
  if (order) {
    order.status = status
    order.statusText = status === 'new' ? 'Новый' : status === 'processing' ? 'В обработке' : status === 'delivered' ? 'Доставлен' : 'Отменён'
    showNotification(`Статус заказа #${order.number} обновлён`, 'success')
  }
}
const viewOrder = (order) => { selectedOrder.value = order; orderModalOpen.value = true }

// Модальные окна
const productModalOpen = ref(false)
const orderModalOpen = ref(false)
const editingProduct = ref(null)
const selectedOrder = ref(null)
const productForm = ref({ name: '', brand: '', price: 0, image: '', description: '' })

const openProductModal = (product = null) => {
  editingProduct.value = product
  if (product) productForm.value = { ...product }
  else productForm.value = { name: '', brand: '', price: 0, image: '', description: '' }
  productModalOpen.value = true
}
const saveProduct = () => {
  if (editingProduct.value) {
    const index = products.value.findIndex(p => p.id === editingProduct.value.id)
    products.value[index] = { ...productForm.value, id: editingProduct.value.id }
    showNotification('Товар обновлён', 'success')
  } else {
    products.value.push({ ...productForm.value, id: Date.now(), rating: 0, reviews: 0 })
    showNotification('Товар добавлен', 'success')
  }
  productModalOpen.value = false
}
const deleteProduct = (id) => { 
  if (confirm('Удалить товар?')) {
    products.value = products.value.filter(p => p.id !== id)
    showNotification('Товар удалён', 'success')
  }
}
</script>

<style scoped>
/* ===== ОСНОВНЫЕ СТИЛИ АДМИНКИ ===== */
.admin-page {
  background: var(--bg-primary);
  min-height: calc(100vh - 80px);
  padding-bottom: 20px;
}

.admin-header {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  padding: 30px 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 51, 102, 0.2);
  margin-bottom: 30px;
}

.admin-header h1 {
  font-size: 1.8rem;
  color: white;
  margin-bottom: 8px;
}

.admin-header p {
  color: var(--text-secondary);
}

/* Контейнер */
.admin-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  gap: 30px;
}

/* Боковое меню */
.admin-sidebar {
  width: 260px;
  flex-shrink: 0;
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
  text-align: left;
  transition: all 0.3s;
}

.admin-menu-item:hover {
  background: rgba(255, 51, 102, 0.1);
  color: var(--accent-primary);
}

.admin-menu-item.active {
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  color: white;
}

.menu-badge {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
}

/* Основной контент */
.admin-content {
  flex: 1;
}

/* Статистика */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
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
  background: rgba(255, 51, 102, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--accent-primary);
}

.stat-info h3 {
  color: white;
  font-size: 1.5rem;
}

/* ===== СТИЛИЗОВАННАЯ КНОПКА ДОБАВЛЕНИЯ ТОВАРА ===== */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.section-header h2 {
  color: white;
  font-size: 1.3rem;
  margin: 0;
}

.btn-add-product {
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  border: none;
  border-radius: 40px;
  padding: 12px 28px;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(255, 51, 102, 0.3);
}

.btn-add-product:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 51, 102, 0.4);
  background: linear-gradient(135deg, #ff4477, #ff7b4d);
}

.btn-add-product:active {
  transform: translateY(1px);
}

.btn-add-product i {
  font-size: 1.2rem;
}

/* Таблицы */
.admin-table {
  width: 100%;
  background: var(--bg-card);
  border-radius: 16px;
  overflow-x: auto;
  display: block;
}

.admin-table th,
.admin-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.admin-table th {
  background: rgba(255, 51, 102, 0.1);
  color: white;
  font-weight: 600;
}

.product-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
}

/* Кнопки действий */
.btn-edit, .btn-delete, .btn-view {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  margin: 0 3px;
  border-radius: 6px;
  transition: all 0.3s;
}

.btn-edit { color: #44cc44; }
.btn-delete { color: #ff4444; }
.btn-view { color: #44ccff; }

.btn-edit:hover, .btn-delete:hover, .btn-view:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

/* Выпадающие списки */
.status-select, .filter-select, .role-select {
  padding: 6px 12px;
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
}

/* Поиск */
.search-input {
  padding: 10px 16px;
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  color: white;
  width: 250px;
}

/* Пользователи */
.users-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.user-stat-item {
  background: var(--bg-card);
  padding: 8px 20px;
  border-radius: 30px;
  color: white;
  font-size: 0.85rem;
}

.users-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-card {
  background: var(--bg-card);
  border-radius: 16px;
  overflow: hidden;
}

.user-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  flex-wrap: wrap;
}

.user-avatar i {
  font-size: 3rem;
  color: var(--accent-primary);
}

.user-basic h4 {
  color: white;
  margin: 0;
}

.user-email {
  color: var(--text-muted);
  margin: 4px 0 0;
}

.user-card-body {
  padding: 20px;
}

.user-info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.user-info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.user-stats-detail {
  display: flex;
  gap: 30px;
  padding: 15px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.detail-stat {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--accent-primary);
}

.stat-desc {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.user-card-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* Модальные окна */
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

.btn-cancel, .btn-save {
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-cancel {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-save {
  background: linear-gradient(135deg, #ff3366, #ff6b3d);
  border: none;
  color: white;
}

/* Адаптация */
@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
  }
  
  .admin-menu-item {
    justify-content: center;
  }
  
  .user-card-header {
    flex-direction: column;
    text-align: center;
  }
  
  .user-info-row {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    text-align: center;
  }
  
  .btn-add-product {
    width: 100%;
    justify-content: center;
  }
}
</style>
