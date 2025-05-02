<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionItem from '@/components/Home/SectionItem.vue'

const { t } = useI18n()

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    console.error('Element with id "content" not found')
  }
}
</script>

<template>
  <main>
    <header>
      <h1>{{ t('brand') }}</h1>
      <h2>{{ t('brand_family') }}</h2>

      <div class="more" @click="scrollToSection('after-header')">
        <img src="../assets/utils/arrow_down.svg" alt="arrow down" />
        <p>{{ t('home.header.see_more') }}</p>
      </div>
    </header>

    <div class="section" id="after-header">
      <h2 class="section-title">{{ t('home.section_title') }}</h2>

      <div class="section-grid">
        <SectionItem to-name="domain">
          <template #title>{{ t('home.section_1.title') }}</template>
          <template #image><img src="@/assets/domaine-generique.jpg" alt="Logo" /></template>
        </SectionItem>
        <SectionItem to-name="wine">
          <template #title>{{ t('home.section_2.title') }}</template>
          <template #image><img src="@/assets/vins-generique.jpg" alt="Logo" /></template>
        </SectionItem>
        <SectionItem to-name="accommodation">
          <template #title>{{ t('home.section_3.title') }}</template>
          <template #image><img src="@/assets/hebergement-generique.jpg" alt="Logo" /></template>
        </SectionItem>
        <SectionItem to-name="contact">
          <template #title>{{ t('home.section_4.title') }}</template>
          <template #image><img src="@/assets/contact-generique.jpg" alt="Logo" /></template>
        </SectionItem>
      </div>
    </div>

    <section class="section">
      <h2 class="section-title">{{ t('home.visit') }}</h2>

      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d666.8545888532313!2d7.304655969673287!3d48.044259594806256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479164f6f13a612d%3A0xbc49c80d43a98c24!2sDomaine%20Pierre%20De%20Vigne!5e0!3m2!1sfr!2sfr!4v1745918356506!5m2!1sfr!2sfr"
        width="900"
        height="500"
        style="border: 0"
        allowfullscreen
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      />
    </section>
  </main>
</template>

<style scoped>
header {
  width: 100%;
  height: 85vh;
  max-height: 100vh;
  background: url('@/assets/vigne-landing-page.jpg') center/cover no-repeat;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

header h1 {
  font-size: 4rem;
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  margin-bottom: 1rem;
}

header h2 {
  font-size: 2rem;
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

header .more {
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  bottom: 20px;
  background: var(--primary-bg-start);
  padding: 0.1rem 1rem;
  border-radius: 1rem;
  cursor: pointer;
}

header .more img {
  width: 2rem;
  height: 2rem;
  margin-right: 1rem;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem 10rem;
  justify-items: center;
  align-content: center;
}

.section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
}

.section-title {
  font-size: 2.5rem;
  margin: 2rem;
}
</style>
