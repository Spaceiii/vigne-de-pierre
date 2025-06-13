<template>
  <div v-if="loading" class="loading">
    <p>{{ t('common.loading') }}</p>
  </div>

  <div v-else-if="error" class="error">
    <p>{{ error }}</p>
  </div>

  <div v-else>
    <section class="wrapper">
      <div class="box">
        <img :src="bigImage" :alt="range">
      </div>

      <div class="content">
        <h1>{{ name }}</h1>
        <p>{{ description }}</p>
        <p><strong>{{ t('wine_page.tasting') }} :</strong> {{ tasting }}</p>
        <p><strong>{{ t('wine_page.conservation') }} :</strong> {{ conservation }}</p>
        <p><strong>{{ t('wine_page.suggestion') }} :</strong> {{ suggestion }}</p>

        <button class="wine-reservation" @click="addItemToCart">
          {{ t('wine_page.reserve_wine') }}
        </button>
      </div>
    </section>

    <div class="related-wines">
      <div class="related-wines-title">
        <div class="image-wrapper">
          <img :src="imageRange" :alt="range">
        </div>
        <h2>{{ t('wine_page.related_wines') }} <span style="font-style: italic">{{ allWinesData && range ? allWinesData[range].name : '' }}</span></h2>
      </div>
      <div class="wine-cards">
        <div v-for="wine in relatedWines" :key="wine.slug" class="wine-card">
          <router-link :to="`/wine/${wine.slug}`">
            <div class="wine-card-content">
              <h3>{{ wine.name }}</h3>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <div class="other-wines">
      <h2 class="other-wines-title">{{ t('wine_page.other_wines') }}</h2>
      <div v-for="(wines, rangeSlug) in otherWines" :key="rangeSlug" class="wine-range">
        <div class="wine-card-title">
          <div class="image-wrapper">
            <img :src="wines.pierre" :alt="rangeSlug">
          </div>
          {{ allWinesData && allWinesData[rangeSlug] ? allWinesData[rangeSlug].name : rangeSlug }}
        </div>
        <div class="wine-cards">
          <div v-for="wine in wines.wines" :key="wine.slug" class="wine-card">
            <router-link :to="`/wine/${wine.slug}`">
              <div class="wine-card-content">
                <h3>{{ wine.name }}</h3>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

import ImagePierreries from '@/assets/wine_range/pierreries-big.jpg'
import ImagePierresPrecieuses from '@/assets/wine_range/pierres_precieuses-big.jpg'
import ImageGrandsCrus from '@/assets/wine_range/grands_crus-big.jpg'
import ImageVendangesTardives from '@/assets/wine_range/vendanges_tardives-big.jpg'

import PierrePierreries from '@/assets/wine_range/pierreries.jpg'
import PierrePierresPrecieuses from '@/assets/wine_range/pierres_precieuses.jpg'
import PierreGrandsCrus from '@/assets/wine_range/grands_crus.jpg'
import PierreVendangesTardives from '@/assets/wine_range/vendanges_tardives.jpg'

import { getTranslationWine, getWinesByLanguage } from '@/services/wineRequest'
import type { WinesByRange, WineTranslation } from '@/types/wine'
import { useCartStore } from '@/stores/cart.ts'

const { t, locale } = useI18n()

const { id } = defineProps({
  id: { type: String, required: true },
})

const wineData = ref<WineTranslation | null>(null)
const allWinesData = ref<WinesByRange | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

watchEffect(async () => {
  console.log(`Current locale: ${locale.value}`)
  loading.value = true
  error.value = null

  try {
    wineData.value = await getTranslationWine(id, locale.value)

    allWinesData.value = await getWinesByLanguage(locale.value)
  } catch (err) {
    console.error('Error fetching wine data:', err)
    error.value = 'Failed to load wine data'
  } finally {
    loading.value = false
  }
})

const name = computed(() => wineData.value?.name || '')
const description = computed(() => wineData.value?.description || '')
const tasting = computed(() => wineData.value?.tasting || '')
const conservation = computed(() => wineData.value?.conservation || '')
const suggestion = computed(() => wineData.value?.suggestion || '')
const range = computed(() => wineData.value?.rangeSlug || '')

const bigImage = ref('')
const imageRange = computed(() => getPierreImage(range.value))

watchEffect(() => {
  if (range.value === 'pierreries') {
    bigImage.value = ImagePierreries
  } else if (range.value === 'pierres_precieuses') {
    bigImage.value = ImagePierresPrecieuses
  } else if (range.value === 'grands_crus') {
    bigImage.value = ImageGrandsCrus
  } else if (range.value === 'vendanges_tardives') {
    bigImage.value = ImageVendangesTardives
  } else if (range.value) {
    console.error(`Unknown wine range: ${range.value}`)
  }
})

const relatedWines = computed(() => {
  if (!allWinesData.value || !range.value) return []

  // Get wines from the same range
  const rangeData = allWinesData.value[range.value]
  if (!rangeData) return []

  return rangeData.wines.map(wine => ({
    slug: wine.wineSlug,
    name: wine.name
  }))
})

interface WineInfo {
  slug: string
  name: string
}

interface RangeInfo {
  wines: WineInfo[]
  pierre: string
}

const otherWines = computed(() => {
  if (!allWinesData.value || !range.value) return {}

  const result: Record<string, RangeInfo> = {}

  Object.entries(allWinesData.value).forEach(([rangeSlug, rangeData]) => {
    if (rangeSlug === range.value) return

    result[rangeSlug] = {
      wines: rangeData.wines.map(wine => ({
        slug: wine.wineSlug,
        name: wine.name
      })),
      pierre: getPierreImage(rangeSlug)
    }
  })

  return result
})

function getPierreImage(range: string) {
  switch (range) {
    case 'pierreries':
      return PierrePierreries
    case 'pierres_precieuses':
      return PierrePierresPrecieuses
    case 'grands_crus':
      return PierreGrandsCrus
    case 'vendanges_tardives':
      return PierreVendangesTardives
    default:
      console.error(`Unknown wine range: ${range}`)
      return ''
  }
}

const addItemToCart = () => {
  if (!wineData.value) return

  const item = {
    id,
    name: wineData.value.name,
    price: wineData.value.price,
    quantity: 1
  }

  const cartStore = useCartStore()
  cartStore.addItem(item)
}
</script>

<style scoped>
.loading, .error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  width: 100%;
  font-size: 1.5rem;
  color: #333;
}

.error {
  color: #e74c3c;
}

.wrapper {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 2rem;
  padding: 2rem;
  max-width: 1000px;
  margin: 2rem auto 7rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.wrapper:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.box {
  background-color: #cecece;
  width: 300px;
  height: 470px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.box img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.box img:hover {
  transform: scale(1.05);
}

.content {
  flex: 1;
  padding: 1rem;
}

.content h1 {
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  color: #333;
  font-family: 'Georgia', serif;
}

.content p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #555;
}

.content p strong {
  color: #297e00;
}

.related-wines, .other-wines {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 2rem;
}

.related-wines-title, .other-wines-title {
  margin-bottom: 1.5rem;
}

.related-wines h2, .other-wines h2 {
  font-size: 1.8rem;
  color: #333;
}

.related-wines-title {
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 1rem;
}

.wine-range {
  margin-bottom: 2rem;
}

.wine-range .wine-card-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: left;
  font-family: 'Georgia', serif;
}

.image-wrapper {
  width: auto;
  height: 35px;
  overflow: hidden;
}

.wine-range .wine-card-title img {
  margin-right: 0.5rem;
}

.wine-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.wine-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: transform 0.3s ease;
  background-color: #297e00;
}

.wine-card:hover {
  transform: scale(1.05);
}

.wine-card-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.wine-card-content h3 {
  margin: 0;
  color: #f9f9f9;
}

.wine-card a {
  text-decoration: none;
}

.wine-reservation {
  background-color: #297e00;
  color: #fff;
  margin-top: 2rem;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}
</style>
