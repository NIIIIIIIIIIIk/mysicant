import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: []
  }),

  getters: {
    getUserOrders: (state) => (userId) => {
      return state.orders.filter(order => order.userId === userId)
    },
    getAllOrders: (state) => {
      return state.orders
    },
    getPendingOrders: (state) => {
      return state.orders.filter(order => order.status !== 'delivered')
    }
  },

  actions: {
    createOrder(orderData) {
      const newOrder = {
        id: Date.now(),
        orderNumber: 'ORD-' + Date.now(),
        date: new Date().toLocaleDateString('ru-RU'),
        status: 'pending',
        statusText: 'Ожидает подтверждения',
        ...orderData
      }
      this.orders.push(newOrder)
      this.saveToLocalStorage()
      return newOrder
    },

    updateOrderStatus(orderId, status) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = status
        order.statusText = status === 'pending' ? 'Ожидает подтверждения' 
                         : status === 'confirmed' ? 'Подтверждён' 
                         : 'Доставлен'
        this.saveToLocalStorage()
      }
    },

    markAsDelivered(orderId) {
      const order = this.orders.find(o => o.id === orderId)
      if (order) {
        order.status = 'delivered'
        order.statusText = 'Доставлен'
        this.saveToLocalStorage()
      }
    },

    saveToLocalStorage() {
      localStorage.setItem('orders', JSON.stringify(this.orders))
    },

    loadFromLocalStorage() {
      const saved = localStorage.getItem('orders')
      if (saved) {
        this.orders = JSON.parse(saved)
      }
    }
  }
})
