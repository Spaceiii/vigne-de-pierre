<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section>
    <h1>{{ t('accommodation.title') }}</h1>

    <div class="content">
      <img src="@/assets/hebergement.jpg" :alt="t('accommodation.alt')"/>

      <div>
        <h2>{{ t('accommodation.subtitle') }}</h2>

        <p v-html="t('accommodation.content')"/>
      </div>

    </div>
  </section>
</template>

<style scoped>
h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

section .content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
}

section .content img {
  flex: 1;
  padding: 1rem;
}

section .content p {
  height: 100%;
}
</style>
