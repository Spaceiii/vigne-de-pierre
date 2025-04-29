<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="not-found">
    <h1>{{ t('notFound.title') }}</h1>
    <h2>{{ t('notFound.message') }}</h2>

    <router-link to="/" class="home-link">{{ t('notFound.back') }}</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - var(--footer-spacing) - 1.3 * var(--footer-height));
}

.not-found h1 {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.not-found h2 {
  font-size: 1.5rem;
  text-align: center;
}

.not-found .home-link {
  margin-top: 2rem;
  padding: 1rem 2rem;
  background-color: var(--primary-bg-start);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1.2rem;
}
</style>


