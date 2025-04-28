<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionItem from "@/components/Home/SectionItem.vue";

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
        <img src="@/assets/arrow_down.svg" alt="arrow down" />
        <p>{{ t('home.header.see_more') }}</p>
      </div>
    </header>

    <div class="section-grid" id="after-header">
      <SectionItem>
        <template #title>{{ t('home.section_1.title') }}</template>
        <template #image><img src="@/assets/vigne-landing-page.jpg" alt="Logo"></template>
      </SectionItem>
      <SectionItem>
        <template #title>{{ t('home.section_2.title') }}</template>
        <template #image><img src="@/assets/vigne-landing-page.jpg" alt="Logo"></template>
      </SectionItem>
      <SectionItem>
        <template #title>{{ t('home.section_3.title') }}</template>
        <template #image><img src="@/assets/vigne-landing-page.jpg" alt="Logo"></template>
      </SectionItem>
      <SectionItem>
        <template #title>{{ t('home.section_4.title') }}</template>
        <template #image><img src="@/assets/vigne-landing-page.jpg" alt="Logo"></template>
      </SectionItem>
    </div>
  </main>
</template>

<style scoped>
header {
  width: 100%;
  height: 85vh;
  max-height: 100vh;
  background: url("@/assets/vigne-landing-page.jpg") center/cover no-repeat;

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
  padding: .1rem 1rem;
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
</style>
