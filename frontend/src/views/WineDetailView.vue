<template>
  <section class="wrapper">
    <div class="box">
      <img :src="bigImage" :alt="range">
    </div>

    <div class="content">
      <h1>{{ name }}</h1>
      <p>{{ description }}</p>
      <p><strong>Dégustation :</strong> {{ tasting }}</p>
      <p><strong>Conservation :</strong> {{ conservation }}</p>
      <p><strong>Suggestion :</strong> {{ suggestion }}</p>
    </div>
  </section>

  <div class="related-wines">
    <div class="related-wines-title">
      <div class="image-wrapper">
        <img :src="imageRange" :alt="imageRange">
      </div>
      <h2>Autres vins de la gamme <span style="font-style: italic">{{ t(`wine.${range}.title`) }}</span></h2>
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
    <h2 class="other-wines-title">Autres vins</h2>
    <div v-for="(wines, range) in otherWines" :key="range" class="wine-range">
      <div class="wine-card-title">
        <div class="image-wrapper">
          <img :src="wines.pierre" :alt="wines.pierre">
        </div>
        {{ t(`wine.${range}.title`) }}</div>
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import ImagePierreries from '@/assets/wine_range/pierreries-big.jpg'
import ImagePierresPrecieuses from '@/assets/wine_range/pierres_precieuses-big.jpg'
import ImageGrandsCrus from '@/assets/wine_range/grands_crus-big.jpg'
import ImageVendangesTardives from '@/assets/wine_range/vendanges_tardives-big.jpg'

import PierrePierreries from '@/assets/wine_range/pierreries.jpg'
import PierrePierresPrecieuses from '@/assets/wine_range/pierres_precieuses.jpg'
import PierreGrandsCrus from '@/assets/wine_range/grands_crus.jpg'
import PierreVendangesTardives from '@/assets/wine_range/vendanges_tardives.jpg'

import wineData from '@/data/wine.json'

const { t } = useI18n()

const { id } = defineProps({
  id: { type: String, required: true },
})

const {
  name,
  description,
  tasting,
  conservation,
  suggestion,
  range
} = {
  name: t(`wine_list.${id}.name`),
  description: t(`wine_list.${id}.description`),
  tasting: t(`wine_list.${id}.tasting`),
  conservation: t(`wine_list.${id}.conservation`),
  suggestion: t(`wine_list.${id}.suggestion`),
  range: t(`wine_list.${id}.range`),
}

const bigImage = ref('')
const imageRange = getPierreImage(range)

if (range === 'pierreries') {
  bigImage.value = ImagePierreries
} else if (range === 'pierres_precieuses') {
  bigImage.value = ImagePierresPrecieuses
} else if (range === 'grands_crus') {
  bigImage.value = ImageGrandsCrus
} else if (range === 'vendanges_tardives') {
  bigImage.value = ImageVendangesTardives
} else {
  console.error(`Unknown wine range: ${range}`)
}

const relatedWines = computed(() => {
  const rangeData = wineData.find(data => data.range_id === range.toLowerCase())
  if (!rangeData) return []

  return rangeData.wines_slug.map(slug => ({
    slug,
    name: t(`wine_list.${slug}.name`),
  }))
})

const otherWines = computed(() => {
  const other = wineData.filter(data => data.range_id !== range.toLowerCase())

  let wines: {[range: string]: {
    wines: {slug: string, name: string}[],
    pierre: string
  }} = {}

  other.forEach((data) => {
    wines[data.range_id] = {
      wines: data.wines_slug.map(slug => ({
        slug,
        name: t(`wine_list.${slug}.name`)
      })),
      pierre: getPierreImage(data.range_id)
    }
  })

  return wines
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
</script>

<style scoped>
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
</style>
