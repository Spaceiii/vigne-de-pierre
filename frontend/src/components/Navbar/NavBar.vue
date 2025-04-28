<script setup lang="ts">
import {useI18n} from "vue-i18n";

const { t } = useI18n()
</script>

<template>
  <nav id="navbar">

    <div class="left">
      <router-link to="/">
        <img src="@/assets/logo.png" :alt="t('logo') + 'Pierre de vigne'">
        <h1>Pierre de vigne</h1>
      </router-link>
    </div>
    <div class="right"></div>
  </nav>
</template>

<style scoped>
h1, h2, h3, h4, h5, h6 {
  margin: 0;
  line-height: 1.2;
  text-decoration: none;
}

#navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: linear-gradient(to right, var(--primary-bg-start), var(--primary-bg-end));
  height: 4rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 999;
}

#navbar .left, #navbar .right {
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

</style>
