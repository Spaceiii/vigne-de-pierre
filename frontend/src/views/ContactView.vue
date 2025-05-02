<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section>
    <h1>{{ t('contact.title') }}</h1>

    <div class="content">
      <div class="on_place">
        <div class="text-box">
          <h2>{{ t('contact.on_place') }}</h2>

          <p>{{ t('brand_family') }}</p>
          <p>{{ t('contact.address') }}</p>

          <h2>{{ t('contact.schedule') }}</h2>

          <p>{{ t('contact.schedule_0') }}</p>
          <p>{{ t('contact.schedule_1') }}</p>

          <p>{{ t('contact.group') }} :</p>
          <ul>
            <li>{{ t('contact.group_0') }}</li>
            <li>{{ t('contact.group_1') }}</li>
            <li>{{ t('contact.group_2') }}</li>
            <li>{{ t('contact.group_3') }}</li>
          </ul>

          <router-link to="/" class="reservation">{{ t('contact.reservation') }}</router-link>

        </div>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d666.8545888532313!2d7.304655969673287!3d48.044259594806256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479164f6f13a612d%3A0xbc49c80d43a98c24!2sDomaine%20Pierre%20De%20Vigne!5e0!3m2!1sfr!2sfr!4v1745934471462!5m2!1sfr!2sfr" width="600" height="450" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <div class="online">
        <h2>{{ t('contact.online') }}</h2>

        <div class="info">
          <p>{{ t('contact.phone') }} : <a href="tel:0389413248">03&nbsp;89&nbsp;41&nbsp;32&nbsp;48</a></p>
          <p>{{ t('contact.email') }} : <a href="mailto:vignedepierre@gmail.com">vignedepierre@gmail.com</a></p>
        </div>
      </div>
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

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
}

.left, .online {
  flex: 1;
  padding: 1rem;
}

.on_place {
  display: flex;
  flex-direction: row-reverse;
  align-items: start;
  justify-content: center;
}

.on_place p {
  margin-top: 0;
  margin-bottom: .5rem;
}

.on_place .text-box {
  flex: 1;
  padding: 1rem;
}

.online {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.online h2 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.online .info p {
  margin: 0 0 .5rem;
}

.reservation {
  background: var(--primary-bg-start);
  display: block;
  width: max-content;
  color: white;
  padding: .5rem 1rem;
  border-radius: .5rem;
  text-decoration: none;
  font-size: 1.2rem;
  margin: 1.5rem auto;
}
</style>
