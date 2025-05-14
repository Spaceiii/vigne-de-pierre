<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const { t, locale } = useI18n()

const route = useRoute()

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
        <button @click="toggleI18N">jgepfz</button>
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
}

#navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: linear-gradient(to right, var(--primary-bg-start), var(--primary-bg-end));
  height: 4rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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
  height: 2.8rem;
  margin-right: 1rem;
  transition: transform 0.3s ease;
}

#navbar .left img:hover {
  transform: scale(1.05);
}

#navbar .left h1 {
  font-size: 1.5rem;
  color: #f0f0f0;
  font-weight: bold;
  letter-spacing: 1px;
}

#navbar .right {
  gap: 1rem;
}

.sub-nav {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: white;
  border-bottom: 1px solid var(--primary-bg-start);
  height: 4rem;
}

.sub-nav a {
  color: var(--primary-bg-start);
  text-decoration: none;
  font-size: 1.2rem;
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.sub-nav a:hover,
.sub-nav a.active {
  background-color: var(--primary-bg-start);
  color: white;
}
</style>
