
// Единая система уведомлений
export const showNotification = (message, type = 'info') => {
  // Удаляем старые уведомления
  const oldNotifications = document.querySelectorAll('.custom-notification')
  oldNotifications.forEach(n => n.remove())

  const notification = document.createElement('div')
  notification.className = `custom-notification custom-notification-${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <i class="bi bi-${getIcon(type)}"></i>
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `
  document.body.appendChild(notification)

  // Анимация появления
  setTimeout(() => notification.classList.add('show'), 10)

  // Закрытие по кнопке
  notification.querySelector('.notification-close').onclick = () => {
    notification.classList.remove('show')
    setTimeout(() => notification.remove(), 300)
  }

  // Автоматическое закрытие через 4 секунды
  setTimeout(() => {
    if (notification) {
      notification.classList.remove('show')
      setTimeout(() => notification.remove(), 300)
    }
  }, 4000)
}

const getIcon = (type) => {
  switch (type) {
    case 'success': return 'check-circle-fill'
    case 'error': return 'exclamation-triangle-fill'
    case 'warning': return 'exclamation-triangle'
    default: return 'info-circle-fill'
  }
}
