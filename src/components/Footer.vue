<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-info">
          <span>© 2026 Интернет-магазин музыкальных инструментов</span>
        </div>
        <div class="footer-links">
          <a href="#" class="social-link" @click.prevent="openMessenger">
            <i class="bi bi-whatsapp"></i>
            <span>Написать в Мессенджер Макс</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const openMessenger = () => {
  // Ссылка на Мессенджер Макс (WhatsApp)
  window.open('https://wa.me/79991234567', '_blank')
}
</script>

<style scoped>
.footer {
  background: #0a0a0a;
  border-top: 1px solid #2a2a3a;
  padding: 20px;
  margin-top: 40px;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-info {
  color: #888;
  font-size: 0.8rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
  text-decoration: none;
  transition: color 0.2s;
}

.social-link:hover {
  color: #25D366;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
