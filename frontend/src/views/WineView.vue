<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import WineRange from "@/components/Wine/WineRange.vue";
const { t } = useI18n()

import PierreriesImage from '@/assets/wine_range/pierreries-big.jpg'
import PierresPrecieusesImage from '@/assets/wine_range/pierres_precieuses-big.jpg'
import GrandsCrusImage from '@/assets/wine_range/grands_crus-big.jpg'
import VendangesTardivesImage from '@/assets/wine_range/vendanges_tardives-big.jpg'

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
        <div class="img-wrapper">
          <img src="@/assets/wine_range/pierreries.jpg" alt="" />
        </div>
        {{ t('wine.pierreries.title') }}</a
      >
      <a
        :class="{ active: activeSection === 'pierres_precieuses' }"
        href="#pierres_precieuses"
        @click="scrollToSection('pierres_precieuses')"
      >
        <div class="img-wrapper">
          <img src="@/assets/wine_range/pierres_precieuses.jpg" alt="" />
        </div>
        {{ t('wine.pierres_precieuses.title') }}</a
      >
      <a
        :class="{ active: activeSection === 'grands_crus' }"
        href="#grands_crus"
        @click="scrollToSection('grands_crus')"
      >
        <div class="img-wrapper">
          <img src="@/assets/wine_range/grands_crus.jpg" alt="" />
        </div>
        {{ t('wine.grands_crus.title') }}</a
      >
      <a
        :class="{ active: activeSection === 'vendanges_tardives' }"
        href="#vendanges_tardives"
        @click="scrollToSection('vendanges_tardives')"
      >
        <div class="img-wrapper">
          <img src="@/assets/wine_range/vendanges_tardives.jpg" alt="" />
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
          :wineSlug="[
            'sylvaner',
            'pinot_gris',
            'riesling',
            'gewurztraminer',
            'pinot_noir',
            'muscat',
            'cremant-d-alsace',
            'pinot_blanc',
          ]"/>

        <WineRange
          id="pierres_precieuses"
          :title="t('wine.pierres_precieuses.title')"
          :image-src="PierresPrecieusesImage"
          :image-alt="t('wine.pierres_precieuses.title')"
          :description="t('wine.pierres_precieuses.description')"
          :wineSlug="[
            'riesling_emeraude',
            'pinot_gris_saphir',
            'gewurztraminer_diamant',
            'pinot_noir_rubis',
          ]"/>

        <WineRange
          id="grands_crus"
          :title="t('wine.grands_crus.title')"
          :image-src="GrandsCrusImage"
          :image-alt="t('wine.grands_crus.title')"
          :description="t('wine.grands_crus.description')"
          :wineSlug="[
            'riesling_eichberg',
            'pinot_gris_eichberg',
            'gewurztraminer_pfersigberg',
          ]"/>

        <WineRange
          id="vendanges_tardives"
          :title="t('wine.vendanges_tardives.title')"
          :image-src="VendangesTardivesImage"
          :image-alt="t('wine.vendanges_tardives.title')"
          :description="t('wine.vendanges_tardives.description')"
          :wineSlug="[
            'gewurztraminer_vendanges_tardives',
            'pinot_gris_vendanges_tardives',
          ]"/>
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
  border-right: 1px solid rgb(0, 0, 0);
  background-color: white;
  margin-top: 8rem;
}

.sidebar h2 {
  text-align: center;
  font-size: 1.5rem;
  padding: 2rem 0;
}

nav a {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  padding: 1rem;
  text-decoration: none;
  font-size: 1.2rem;
}

nav a.active {
  color: black;
}

nav a .img-wrapper {
  display: inline-block;
  height: 35px;
  overflow: hidden;
  padding-right: 1.5rem;
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
