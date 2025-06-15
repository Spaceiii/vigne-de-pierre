<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart.ts'
import { useAuthStore } from '@/stores/auth.ts'

const { t, locale } = useI18n()

const route = useRoute()
const cartStore = useCartStore()
const authStore = useAuthStore()

const needNav = computed(() => {
  return route.name !== 'home' && route.name !== 'not-found'
})

const toggleI18N = () => {
  const currentLocale = locale.value
  const newLocale = currentLocale === 'fr' ? 'en' : 'fr'
  locale.value = newLocale
  document.documentElement.setAttribute('lang', newLocale)
  localStorage.setItem('locale', newLocale)
}
</script>

<template>
  <div class="nav-container">
    <nav id="navbar">
      <div class="left">
        <router-link to="/">
          <img src="@/assets/logo.png" :alt="t('logo') + 'Pierre de vigne'" />
          <h1>Pierre de vigne</h1>
        </router-link>
      </div>
      <div class="right">
        <router-link v-if="authStore.user && !authStore.user.isAdmin" to="/orders"
                     class="nav-button orders-link">
          <span class="nav-icon">📋</span>
          <span class="nav-text">{{ t('nav.orders') }}</span>
        </router-link>
        <router-link
          v-else-if="authStore.user?.isAdmin"
          to="/admin/orders"
          class="nav-button orders-link"
        >
          <span class="nav-icon">🛠️</span>
          <span class="nav-text">{{ t('nav.adminOrders') }}</span>
        </router-link>
        <router-link v-else to="/login" class="nav-button login-link">
          <span class="nav-icon">👤</span>
          <span class="nav-text">{{ t('auth.login') }}</span>
        </router-link>
        <button @click="cartStore.toggleCart" class="nav-button cart-button">
          <span class="nav-icon">🛒</span>
          <span class="nav-text">{{ t('cart.title') }}</span>
        </button>

        <div class="language-selector">
          <select name="language" id="language" v-model="locale">
            <option value="fr" :selected="locale === 'fr'">Français</option>
            <option value="en" :selected="locale === 'en'">English</option>
            <option value="jp" :selected="locale === 'jp'">日本語</option>
          </select>
          <span class="language-icon">🌐</span>
        </div>
      </div>
    </nav>
    <nav class="sub-nav" v-if="needNav">
      <router-link active-class="active" to="/">{{ t('nav.home') }}</router-link>
      <router-link active-class="active" to="/domain">{{ t('nav.domain') }}</router-link>
      <router-link active-class="active" to="/wine">{{ t('nav.wines') }}</router-link>
      <router-link active-class="active" to="/accommodation">{{
        t('nav.accommodation')
      }}</router-link>
      <router-link active-class="active" to="/contact">{{ t('nav.contact') }}</router-link>
    </nav>
  </div>
</template>

<style scoped>
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  line-height: 1.2;
  text-decoration: none;
}

.nav-container {
  position: sticky;
  top: 0;
  z-index: 999;
  height: var(--navbar-height);
}

#navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2.5rem;
  background: linear-gradient(to right, var(--primary-bg-start), var(--primary-bg-end));
  height: 4.2rem;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

#navbar .left,
#navbar .online {
  display: flex;
  align-items: center;
}

#navbar .left a {
  display: flex;
  align-items: center;
  text-decoration: none;
}

#navbar .left img {
  width: auto;
  height: 3rem;
  margin-right: 1.2rem;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

#navbar .left img:hover {
  transform: scale(1.08) rotate(2deg);
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));
}

#navbar .left h1 {
  font-size: 1.6rem;
  color: #ffffff;
  font-weight: bold;
  letter-spacing: 1.2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

#navbar .left a:hover h1 {
  transform: translateX(3px);
}

#navbar .right {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  height: 2.5rem;
  box-sizing: border-box;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.nav-icon {
  font-size: 1.2rem;
}

.orders-link, .login-link {
  /* Additional specific styling for link buttons if needed */
}

.cart-button {
  /* Additional specific styling for cart button if needed */
}

.language-selector {
  position: relative;
  display: flex;
  align-items: center;
  height: 2.5rem;
}

.language-selector select {
  appearance: none;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  height: 2.5rem;
  box-sizing: border-box;
}

.language-selector option {
  color: #333;
  background-color: white;
}

.language-selector select:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.language-icon {
  position: absolute;
  right: 0.8rem;
  pointer-events: none;
  font-size: 1rem;
}

.sub-nav {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: white;
  border-bottom: 1px solid var(--primary-bg-start);
  height: 4rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.sub-nav a {
  color: var(--primary-bg-start);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0.8rem;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  position: relative;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    transform 0.2s ease;
}

.sub-nav a:hover {
  background-color: rgba(72, 84, 87, 0.1);
  color: var(--primary-bg-start);
  transform: translateY(-2px);
}

.sub-nav a.active {
  background-color: var(--primary-bg-start);
  color: white;
  box-shadow: 0 2px 8px rgba(72, 84, 87, 0.3);
}

/* Add responsive styles for smaller screens */
@media (max-width: 768px) {
  #navbar {
    padding: 0 1rem;
  }

  #navbar .left h1 {
    font-size: 1.2rem;
  }

  .nav-text {
    display: none;
  }

  .sub-nav {
    overflow-x: auto;
    justify-content: flex-start;
    padding: 0 1rem;
  }

  .sub-nav a {
    font-size: 1rem;
    padding: 0.5rem 0.8rem;
    white-space: nowrap;
  }
}
</style>
