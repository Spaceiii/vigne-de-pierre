<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section>
    <h1>{{ t('contact.title') }}</h1>

    <div class="content">
      <div class="left">
        <h2>{{ t('contact.on_place') }}</h2>

        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d666.8545888532313!2d7.304655969673287!3d48.044259594806256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479164f6f13a612d%3A0xbc49c80d43a98c24!2sDomaine%20Pierre%20De%20Vigne!5e0!3m2!1sfr!2sfr!4v1745934471462!5m2!1sfr!2sfr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <div class="right">feafae</div>
    </div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
}

.left, .right {
  flex: 1;
  padding: 1rem;
}

.left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
</style>
