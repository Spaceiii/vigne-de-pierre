<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, watchEffect } from 'vue'
import WineRange from "@/components/Wine/WineRange.vue";
import { getWinesByRangeTranslation } from '@/services/wineRequest'
import type { RangeTranslationWithWines } from '@/types/wine'
const { t, locale } = useI18n()

import PierreriesImage from '@/assets/wine_range/pierreries-big.jpg'
import PierresPrecieusesImage from '@/assets/wine_range/pierres_precieuses-big.jpg'
import GrandsCrusImage from '@/assets/wine_range/grands_crus-big.jpg'
import VendangesTardivesImage from '@/assets/wine_range/vendanges_tardives-big.jpg'

import PetitePierreriesImage from '@/assets/wine_range/pierreries.jpg'
import PetitePierresPrecieusesImage from '@/assets/wine_range/pierres_precieuses.jpg'
import PetiteGrandsCrusImage from '@/assets/wine_range/grands_crus.jpg'
import PetiteVendangesTardivesImage from '@/assets/wine_range/vendanges_tardives.jpg'

const rangeData = ref<RangeTranslationWithWines[]>([])
const activeSection = ref('')
const isLoading = ref(true)

const rangeImages: Record<string, string> = {
  pierreries: PierreriesImage,
  pierres_precieuses: PierresPrecieusesImage,
  grands_crus: GrandsCrusImage,
  vendanges_tardives: VendangesTardivesImage
}

const petiteRangeImages: Record<string, string> = {
  pierreries: PetitePierreriesImage,
  pierres_precieuses: PetitePierresPrecieusesImage,
  grands_crus: PetiteGrandsCrusImage,
  vendanges_tardives: PetiteVendangesTardivesImage
}

// Function to fetch range data
const fetchRangeData = async () => {
  isLoading.value = true
  try {
    rangeData.value = await getWinesByRangeTranslation(locale.value)
  } catch (error) {
    console.error('Error fetching wine range data:', error)
    rangeData.value = []
  } finally {
    isLoading.value = false
  }
}

// Set up intersection observer for scrolling
const setupIntersectionObserver = () => {
  setTimeout(() => {
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
  }, 100)
}

const wineDataByRange = ref<{[key: string]: string[]}>({})

// Watch for locale changes, update data and transform it
watchEffect(async () => {
  // Step 1: Fetch the range data when locale changes
  await fetchRangeData()

  // Step 2: Transform rangeData into wineDataByRange
  if (!rangeData.value || rangeData.value.length === 0) {
    wineDataByRange.value = {}
  } else {
    wineDataByRange.value = rangeData.value.reduce((acc: {[key: string]: string[]}, range) => {
      if (range.wines && range.wines.length > 0) {
        acc[range.slug] = range.wines.map(wine => wine.nativeName.toLowerCase().replace(/ /g, '_'))
      }
      return acc
    }, {})
  }

  // Step 3: Set up the intersection observer after data is loaded
  if (!isLoading.value) {
    setupIntersectionObserver()
  }
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
    <div v-if="isLoading" class="loading-container">
      <p>{{ t('common.loading') }}</p>
    </div>

    <template v-else>
      <nav class="sidebar">
        <h2>{{ t('wine.range') }}</h2>

        <a
          v-for="range in rangeData"
          :key="range.slug"
          :class="{ active: activeSection === range.slug }"
          :href="`#${range.slug}`"
          @click="scrollToSection(range.slug)"
        >
          <div class="img-container">
            <div class="img-wrapper">
              <img :src="petiteRangeImages[range.slug]" :alt="range.name" />
            </div>
          </div>
          {{ range.name }}</a
        >
      </nav>

      <div class="wrapper">
        <h1>{{ t('wine.title') }}</h1>
        <section>
          <template v-if="rangeData.length === 0">
            <p class="no-data">{{ t('wine.no_data') }}</p>
          </template>

          <template v-else>
            <WineRange
              v-for="range in rangeData"
              :key="range.slug"
              :id="range.slug"
              :title="range.name"
              :image-src="rangeImages[range.slug]"
              :image-alt="range.name"
              :description="range.description"
              :wineSlug="wineDataByRange[range.slug] || []"
            />
          </template>
        </section>
      </div>
    </template>
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

.language-link {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
}

.language-button {
  display: inline-block;
  background-color: #297e00;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
  font-size: 1rem;
}

.language-button:hover {
  background-color: #1d5e00;
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

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  width: 100%;
  font-size: 1.2rem;
  color: #555;
  font-style: italic;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #555;
  font-style: italic;
  font-size: 1.2rem;
}
</style>
