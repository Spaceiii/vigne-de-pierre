<template>
  <div class="wine-wrapper">
    <div class="wine-range" :id="id">
      <div class="image-wrapper">
        <img
          :src="imageSrc"
          :alt="imageAlt"
          id="pierreries"
        />
      </div>
      <div class="text-content">
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>

        <p>
          <strong>{{ t('wine.presentation') }} : </strong>
          <template v-if="wineNames.length > 0">
            <template v-for="wine in wineNames.slice(0, wineNames.length - 1)" :key="wine">
              {{ wine }},
            </template>
            {{ wineNames[wineNames.length - 1] }}
          </template>
          <template v-else>
            {{ t('wine.no_wines') }}
          </template>
        </p>

        <button class="btn btn-primary" @click="toggleWineList">{{ t('wine.range_details') }}</button>
      </div>
    </div>

    <transition name="slide-fade">
      <div v-show="showWineCards" class="wine-cards">
        <div v-if="isLoading" class="loading-indicator">
          {{ t('common.loading') }}
        </div>
        <template v-else>
          <div v-for="wine in wineInfo" :key="wine.slug" class="wine-card">
            <router-link :to="`/wine/${wine.slug}`">
              <div class="wine-card-content">
                <h3>{{ wine.name }}</h3>
              </div>
            </router-link>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed, ref, onMounted } from 'vue'
import { getWinesByLanguage } from '@/services/wineRequest'
const { t, locale } = useI18n()

const {
  id,
  title,
  imageSrc,
  imageAlt,
  description,
  wineSlug
} = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  imageSrc: { type: String, required: true },
  imageAlt: { type: String, required: true },
  description: { type: String, required: true },
  wineSlug: {
    type: Array<String>,
    required: true,
  },
})

const showWineCards = ref(false);
const toggleWineList = () => {
  showWineCards.value = !showWineCards.value;
};

const wineTranslations = ref<any[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    // Fetch wine translations for the current language
    const data = await getWinesByLanguage(locale.value)

    // Find the range data that matches our id
    const rangeData = data[id]

    if (rangeData && rangeData.wines) {
      // Filter wines to only include those in our wineSlug array
      wineTranslations.value = rangeData.wines.filter(wine => {
        // Convert wine's native name to match the format in wineSlug
        const formattedName = wine.nativeName.toLowerCase().replace(/ /g, '_')
        return wineSlug.includes(formattedName) || wineSlug.includes(wine.wineSlug)
      })
    }
  } catch (error) {
    console.error(`Error fetching wine translations for range ${id}:`, error)
  } finally {
    isLoading.value = false
  }
})

const wineInfo = computed(() => {
  // If we have translations from the API, use those
  if (wineTranslations.value.length > 0) {
    return wineTranslations.value.map(wine => ({
      name: wine.name,
      slug: wine.wineSlug,
      description: wine.description,
      tasting: wine.tasting,
      conservation: wine.conservation,
      suggestion: wine.suggestion,
    }))
  }

  // Fallback to i18n translations if API data is not available
  return wineSlug.map((wineIdentifier) => {
    // The wineIdentifier is the formatted native name (lowercase with underscores)
    // We use it directly as the key for i18n translations
    return {
      name: t(`wine_list.${wineIdentifier}.name`),
      slug: wineIdentifier,
      description: t(`wine_list.${wineIdentifier}.description`),
      tasting: t(`wine_list.${wineIdentifier}.tasting`),
      conservation: t(`wine_list.${wineIdentifier}.conservation`),
      suggestion: t(`wine_list.${wineIdentifier}.suggestion`),
    }
  })
})

const wineNames = computed(() => wineInfo.value.map(wine => wine.name))
</script>

<style scoped>
.wine-wrapper {
  margin: 4rem 8rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.wine-range {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.wine-wrapper:nth-child(even) .wine-range {
  flex-direction: row-reverse;
}

.wine-wrapper:hover {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  transform: scale(1.005);
}

.image-wrapper {
  height: 400px;
}

.image-wrapper img {
  height: 400px;
  width: auto;
}

.text-content {
  padding: 2rem;
}

.text-content h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
}

.btn {
  margin-top: 2rem;
  font-size: 1rem;
  background-color: #297e00;
  color: white;
  padding: .7rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn:hover {
  background-color: #1d5e00;
}

.wine-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 0;
  padding: 1rem;
  transform-origin: top;
}

.wine-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
  background-color: #297e00;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wine-card:hover {
  transform: scale(1.005);
}

.wine-card-content h3 {
  font-size: 1rem;
  margin: 0;
  color: #ffffff;
}

.wine-card a {
  text-decoration: none;
  display: block;
  width: 100%;
  padding: .5rem 1rem;

}

/* eslint-disable-next-line */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
  max-height: 1000px;
  overflow: hidden;
}

/* eslint-disable-next-line */
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  max-height: 0;
}

.loading-indicator {
  text-align: center;
  padding: 1rem;
  color: #555;
  font-style: italic;
  grid-column: 1 / -1;
}

</style>
