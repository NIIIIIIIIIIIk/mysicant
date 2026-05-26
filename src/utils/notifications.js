/**
 * Единая система уведомлений для интернет-магазина музыкальных инструментов
 * 
 * Использование:
 * import { showNotification } from '@/utils/notifications'
 * showNotification('Сообщение', 'success')
 * 
 * Типы: success, error, warning, info
 */

/**
 * Показать уведомление
 * @param {string} message - Текст сообщения
 * @param {string} type - Тип уведомления: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Длительность показа в миллисекундах (по умолчанию 4000)
 */
export const showNotification = (message, type = 'info', duration = 4000) => {
  // Удаляем старые уведомления, чтобы не было кучи
  const oldNotifications = document.querySelectorAll('.custom-notification')
  oldNotifications.forEach(notification => notification.remove())

  // Создаём элемент уведомления
  const notification = document.createElement('div')
  notification.className = `custom-notification custom-notification-${type}`
  
  // Выбираем иконку в зависимости от типа
  const icon = getIcon(type)
  
  notification.innerHTML = `
    <div class="notification-content">
      <i class="bi bi-${icon}"></i>
      <span>${escapeHtml(message)}</span>
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
 * Экранирование HTML-символов для безопасности
 * @param {string} str 
 * @returns {string}
 */
const escapeHtml = (str) => {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Показать уведомление об успехе
 * @param {string} message 
 */
export const showSuccess = (message) => {
  showNotification(message, 'success')
}

/**
 * Показать уведомление об ошибке
 * @param {string} message 
 */
export const showError = (message) => {
  showNotification(message, 'error')
}

/**
 * Показать предупреждение
 * @param {string} message 
 */
export const showWarning = (message) => {
  showNotification(message, 'warning')
}

/**
 * Показать информационное сообщение
 * @param {string} message 
 */
export const showInfo = (message) => {
  showNotification(message, 'info')
}
