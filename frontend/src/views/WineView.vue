<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import WineRange from "@/components/Wine/WineRange.vue";
const { t } = useI18n()

import PierreriesImage from '@/assets/wine_range/pierreries-big.jpg'
import PierresPrecieusesImage from '@/assets/wine_range/pierres_precieuses-big.jpg'
import GrandsCrusImage from '@/assets/wine_range/grands_crus-big.jpg'
import VendangesTardivesImage from '@/assets/wine_range/vendanges_tardives-big.jpg'

import wineData from '@/data/wine.json'


const activeSection = ref('')

onMounted(() => {
  const sections = document.querySelectorAll('.wine-range[id]')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id
        }
      })
    },
    { threshold: 0.6 },
  )

  sections.forEach((section) => observer.observe(section))
})

const wineDataByRange = wineData.reduce((acc: {[key: string]: string[]}, data) => {
  const range = data.range_id.toLowerCase()
  acc[range] = data.wines_slug
  return acc
}, {})

const scrollToSection = (id: string) => {
  const section = document.getElementById(id)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <main>
    <nav class="sidebar">
      <h2>{{ t('wine.range') }}</h2>

      <a
        :class="{ active: activeSection === 'pierreries' }"
        href="#pierreries"
        @click="scrollToSection('pierreries')"
      >
        <div class="img-container">
          <div class="img-wrapper">
            <img src="@/assets/wine_range/pierreries.jpg" alt="Les pierreries" />
          </div>
        </div>
        {{ t('wine.pierreries.title') }}</a
      >
      <a
        :class="{ active: activeSection === 'pierres_precieuses' }"
        href="#pierres_precieuses"
        @click="scrollToSection('pierres_precieuses')"
      >
        <div class="img-container">
          <div class="img-wrapper">
            <img src="@/assets/wine_range/pierres_precieuses.jpg" alt="Les pierres précieuses" />
          </div>
        </div>
        {{ t('wine.pierres_precieuses.title') }}</a
      >
      <a
        :class="{ active: activeSection === 'grands_crus' }"
        href="#grands_crus"
        @click="scrollToSection('grands_crus')"
      >
        <div class="img-container">
          <div class="img-wrapper">
            <img src="@/assets/wine_range/grands_crus.jpg" alt="Les grands crus" />
          </div>
        </div>
        {{ t('wine.grands_crus.title') }}</a
      >
      <a
        :class="{ active: activeSection === 'vendanges_tardives' }"
        href="#vendanges_tardives"
        @click="scrollToSection('vendanges_tardives')"
      >
        <div class="img-container">
          <div class="img-wrapper">
            <img src="@/assets/wine_range/vendanges_tardives.jpg" alt="Les vendanges tardives" />
          </div>
        </div>
        {{ t('wine.vendanges_tardives.title') }}</a
      >
    </nav>
    <div class="wrapper">
      <h1>{{ t('wine.title') }}</h1>
      <section>
        <WineRange
          id="pierreries"
          :title="t('wine.pierreries.title')"
          :image-src="PierreriesImage"
          :image-alt="t('wine.pierreries.title')"
          :description="t('wine.pierreries.description')"
          :wineSlug="wineDataByRange.pierreries"/>

        <WineRange
          id="pierres_precieuses"
          :title="t('wine.pierres_precieuses.title')"
          :image-src="PierresPrecieusesImage"
          :image-alt="t('wine.pierres_precieuses.title')"
          :description="t('wine.pierres_precieuses.description')"
          :wineSlug="wineDataByRange.pierres_precieuses"/>

        <WineRange
          id="grands_crus"
          :title="t('wine.grands_crus.title')"
          :image-src="GrandsCrusImage"
          :image-alt="t('wine.grands_crus.title')"
          :description="t('wine.grands_crus.description')"
          :wineSlug="wineDataByRange.grands_crus"/>

        <WineRange
          id="vendanges_tardives"
          :title="t('wine.vendanges_tardives.title')"
          :image-src="VendangesTardivesImage"
          :image-alt="t('wine.vendanges_tardives.title')"
          :description="t('wine.vendanges_tardives.description')"
          :wineSlug="wineDataByRange.vendanges_tardives"/>
      </section>
    </div>
  </main>
</template>

<style scoped>
main {
  scroll-behavior: smooth;
}

.wrapper {
  margin-left: 20vw;
}

h1 {
  font-size: 3.5rem;
  padding: 3rem 0;
  text-align: center;
  font-weight: bolder;
  font-style: italic;
}

/*  ------
 *  Sidebar styles
 */

nav {
  width: 20vw;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow: auto;
  border-right: 1px solid #e0e0e0;
  background-color: #f8f8f8;
  margin-top: 8rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar h2 {
  text-align: center;
  font-size: 1.5rem;
  padding: 2rem 0;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
}

nav a {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  padding: 1rem;
  text-decoration: none;
  font-size: 1.2rem;
  color: #555;
  transition: background-color 0.3s, color 0.3s;
}

nav a:hover {
  background-color: #e9e9e9;
  color: #000;
}

nav .img-container {
  --img-size: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--img-size);
  height: var(--img-size);
  background: #f8f8f8;
  margin-right: 1rem;
  border-radius: 50%;
  overflow: hidden;
}

nav a.active {
  color: #000;
  background-color: #ddd;
}

nav a .img-wrapper {
  display: inline-block;
  height: 35px;
  overflow: hidden;
}

nav a img {
  width: auto;
  height: 70px;
  transform: translateY(-35px);
}

nav a.active img {
  transform: translateY(0);
}

/*  ------
 *  Navbar styles
 */

section {
  width: calc(79vw - 1px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
