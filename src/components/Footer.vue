<template>
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-left">
        <i class="bi bi-music-note-beamed"></i>
        <span>Music Store</span>
        <span class="separator">|</span>
        <span>© 2026</span>
      </div>
      
      <div class="footer-center">
        <router-link to="/">Главная</router-link>
        <router-link to="/catalog">Каталог</router-link>
        <router-link to="/contacts">Контакты</router-link>
      </div>
      
      <div class="footer-right">
        <a href="#" class="social"><i class="bi bi-vk"></i></a>
        <a href="#" class="social"><i class="bi bi-telegram"></i></a>
        <a href="#" class="social"><i class="bi bi-instagram"></i></a>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Нет сложной логики
</script>

<style scoped>
.site-footer {
  background: #0a0a0a;
  border-top: 1px solid #2a2a3a;
  padding: 12px 24px;
  width: 100%;
  margin-top: 40px;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #888;
}

.footer-left i {
  color: #ff3366;
  font-size: 16px;
}

.separator {
  color: #333;
}

.footer-center {
  display: flex;
  gap: 24px;
}

.footer-center a {
  color: #888;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s;
}

.footer-center a:hover {
  color: #ff3366;
}

.footer-right {
  display: flex;
  gap: 12px;
}

.social {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  color: #888;
  text-decoration: none;
  transition: all 0.2s;
}

.social:hover {
  background: #ff3366;
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-center {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>