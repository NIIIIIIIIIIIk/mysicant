<template>
  <div class="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  authStore.loadUser()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 100%;
}

/* Принудительное растяжение для всех контейнеров */
.container, .container-fluid {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: auto !important;
  margin-right: auto !important;
}
</style>