import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    userRole: localStorage.getItem('userRole') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.userRole === 'admin',
    userName: (state) => {
      if (state.user?.firstName && state.user?.lastName) {
        return `${state.user.firstName} ${state.user.lastName}`
      }
      if (state.user?.name) {
        return state.user.name
      }
      return state.user?.email?.split('@')[0] || 'Пользователь'
    }
  },

  actions: {
    /**
     * Вход пользователя
     */
    async login(email, password, remember = false) {
      // Мок-данные для демонстрации (без реального API)
      
      // Администратор
      if (email === 'admin@musicstore.ru' && password === 'admin123') {
        this.token = 'fake-token-admin-' + Date.now()
        this.user = { 
          id: 1,
          firstName: 'Админ', 
          lastName: 'Админович',
          name: 'Администратор',
          email: email, 
          role: 'admin',
          phone: '+7 (999) 123-45-67',
          address: 'г. Москва, ул. Админская, д. 1',
          registered: '01.01.2026'
        }
        this.userRole = 'admin'
        
        // Сохраняем в localStorage
        localStorage.setItem('token', this.token)
        localStorage.setItem('userRole', 'admin')
        localStorage.setItem('user', JSON.stringify(this.user))
        if (remember) {
          localStorage.setItem('rememberEmail', email)
        } else {
          localStorage.removeItem('rememberEmail')
        }
        
        return true
      }
      
      // Обычный пользователь
      if (email === 'user@example.com' && password === 'user123') {
        this.token = 'fake-token-user-' + Date.now()
        this.user = { 
          id: 2,
          firstName: 'Обычный', 
          lastName: 'Пользователь',
          name: 'Пользователь',
          email: email, 
          role: 'user',
          phone: '+7 (999) 876-54-32',
          address: 'г. Москва, ул. Пользовательская, д. 10',
          registered: '15.05.2026'
        }
        this.userRole = 'user'
        
        localStorage.setItem('token', this.token)
        localStorage.setItem('userRole', 'user')
        localStorage.setItem('user', JSON.stringify(this.user))
        if (remember) {
          localStorage.setItem('rememberEmail', email)
        } else {
          localStorage.removeItem('rememberEmail')
        }
        
        return true
      }
      
      // Любой другой пользователь (для демонстрации)
      if (email && password && password.length >= 6) {
        this.token = 'fake-token-' + Date.now()
        this.user = { 
          id: Date.now(),
          firstName: email.split('@')[0],
          lastName: '',
          name: email.split('@')[0],
          email: email, 
          role: 'user',
          phone: '',
          address: '',
          registered: new Date().toLocaleDateString('ru-RU')
        }
        this.userRole = 'user'
        
        localStorage.setItem('token', this.token)
        localStorage.setItem('userRole', 'user')
        localStorage.setItem('user', JSON.stringify(this.user))
        if (remember) {
          localStorage.setItem('rememberEmail', email)
        }
        
        return true
      }
      
      return false
    },

    /**
     * Регистрация нового пользователя
     */
    async register(name, email, password, phone = '') {
      this.token = 'fake-token-' + Date.now()
      this.user = { 
        id: Date.now(),
        firstName: name?.split(' ')[0] || email.split('@')[0],
        lastName: name?.split(' ')[1] || '',
        name: name || email.split('@')[0],
        email: email,
        phone: phone,
        role: 'user',
        address: '',
        registered: new Date().toLocaleDateString('ru-RU')
      }
      this.userRole = 'user'
      
      localStorage.setItem('token', this.token)
      localStorage.setItem('userRole', 'user')
      localStorage.setItem('user', JSON.stringify(this.user))
      
      return true
    },

    /**
     * Выход из системы
     */
    logout() {
      this.token = null
      this.user = null
      this.userRole = null
      
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      localStorage.removeItem('user')
      localStorage.removeItem('remember')
      localStorage.removeItem('rememberEmail')
    },

    /**
     * Загрузка данных пользователя из localStorage
     */
    loadUser() {
      const savedToken = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')
      const savedRole = localStorage.getItem('userRole')
      
      if (savedToken && savedUser) {
        this.token = savedToken
        this.user = JSON.parse(savedUser)
        this.userRole = savedRole
      } else if (savedToken) {
        // Если есть токен, но нет данных пользователя
        if (savedRole === 'admin') {
          this.user = {
            id: 1,
            firstName: 'Админ',
            lastName: 'Админович',
            name: 'Администратор',
            email: 'admin@musicstore.ru',
            role: 'admin',
            phone: '+7 (999) 123-45-67',
            address: 'г. Москва, ул. Админская, д. 1',
            registered: '01.01.2026'
          }
        } else {
          this.user = {
            id: 2,
            firstName: 'Обычный',
            lastName: 'Пользователь',
            name: 'Пользователь',
            email: 'user@example.com',
            role: 'user',
            phone: '+7 (999) 876-54-32',
            address: 'г. Москва, ул. Пользовательская, д. 10',
            registered: '15.05.2026'
          }
        }
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },

    /**
     * Обновление профиля пользователя
     */
    updateProfile(data) {
      if (this.user) {
        this.user = { ...this.user, ...data }
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      }
      return false
    },

    /**
     * Смена пароля
     */
    async changePassword(oldPassword, newPassword) {
      if (!this.token) {
        return { success: false, message: 'Не авторизован' }
      }
      
      if (newPassword.length < 6) {
        return { success: false, message: 'Пароль должен быть не менее 6 символов' }
      }
      
      if (oldPassword === newPassword) {
        return { success: false, message: 'Новый пароль должен отличаться от старого' }
      }
      
      // В реальном проекте здесь был бы запрос к API
      return { success: true, message: 'Пароль успешно изменён' }
    },

    /**
     * Получение сохранённого email для автозаполнения
     */
    getRememberEmail() {
      return localStorage.getItem('rememberEmail') || ''
    },

    /**
     * Проверка, авторизован ли пользователь
     */
    checkAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.loadUser()
        return true
      }
      return false
    }
  }
})