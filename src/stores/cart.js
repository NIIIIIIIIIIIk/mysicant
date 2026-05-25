import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),

  getters: {
    totalCount: (state) => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0)
    },
    totalPrice: (state) => {
      return state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }
  },

  actions: {
    addItem(product) {
      const existing = this.items.find(item => item.id === product.id)

      if (existing) {
        existing.quantity++
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          brand: product.brand,
          image: product.image,  // ← Сохраняем фото!
          quantity: 1
        })
      }
      this.saveToLocalStorage()
    },

    removeItem(id) {
      this.items = this.items.filter(item => item.id !== id)
      this.saveToLocalStorage()
    },

    updateQuantity(id, quantity) {
      const item = this.items.find(item => item.id === id)
      if (item) {
        item.quantity = Math.max(1, quantity)
        this.saveToLocalStorage()
      }
    },

    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    loadFromLocalStorage() {
      const saved = localStorage.getItem('cart')
      if (saved) {
        this.items = JSON.parse(saved)
      }
    }
  }
})