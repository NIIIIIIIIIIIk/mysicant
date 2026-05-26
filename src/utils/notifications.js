// Единая система уведомлений для всего приложения

/**
 * Показать уведомление
 * @param {string} message - Текст сообщения
 * @param {string} type - Тип: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Длительность показа в мс (по умолчанию 4000)
 */
export const showNotification = (message, type = 'info', duration = 4000) => {
  // Удаляем старые уведомления
  const oldNotifications = document.querySelectorAll('.custom-notification')
  oldNotifications.forEach(n => n.remove())

  // Создаём элемент уведомления
  const notification = document.createElement('div')
  notification.className = `custom-notification custom-notification-${type}`
  
  // Выбираем иконку в зависимости от типа
  const icon = getIcon(type)
  
  notification.innerHTML = `
    <div class="notification-content">
      <i class="bi bi-${icon}"></i>
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `
  
  document.body.appendChild(notification)

  // Анимация появления
  setTimeout(() => notification.classList.add('show'), 10)

  // Закрытие по кнопке
  const closeBtn = notification.querySelector('.notification-close')
  if (closeBtn) {
    closeBtn.onclick = () => {
      notification.classList.remove('show')
      setTimeout(() => notification.remove(), 300)
    }
  }

  // Автоматическое закрытие
  setTimeout(() => {
    if (notification) {
      notification.classList.remove('show')
      setTimeout(() => notification.remove(), 300)
    }
  }, duration)
}

/**
 * Получить иконку для типа уведомления
 * @param {string} type 
 * @returns {string}
 */
const getIcon = (type) => {
  switch (type) {
    case 'success': return 'check-circle-fill'
    case 'error': return 'exclamation-triangle-fill'
    case 'warning': return 'exclamation-triangle'
    default: return 'info-circle-fill'
  }
}

/**
 * Показать успешное уведомление
 * @param {string} message 
 */
export const showSuccess = (message) => showNotification(message, 'success')

/**
 * Показать ошибку
 * @param {string} message 
 */
export const showError = (message) => showNotification(message, 'error')

/**
 * Показать предупреждение
 * @param {string} message 
 */
export const showWarning = (message) => showNotification(message, 'warning')

/**
 * Показать информационное сообщение
 * @param {string} message 
 */
export const showInfo = (message) => showNotification(message, 'info')
