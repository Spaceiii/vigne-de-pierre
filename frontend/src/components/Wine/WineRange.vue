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
          <template v-for="wine in wineNames.slice(0, wineNames.length - 1)" :key="wine">
            {{ wine }},
          </template>
          {{ wineNames[wineNames.length - 1] }}
        </p>

        <button class="btn btn-primary" @click="toggleWineList">{{ t('wine.range_details') }}</button>
      </div>
    </div>

    <transition name="slide-fade">
      <div v-show="showWineCards" class="wine-cards">
        <div v-for="wine in wineInfo" :key="wine.slug" class="wine-card">
          <router-link :to="`/wine/${wine.slug}`">
            <div class="wine-card-content">
              <h3>{{ wine.name }}</h3>
            </div>
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from "vue";
const { t } = useI18n()

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

const wineInfo = wineSlug.map((wine) => {
  return {
    name: t(`wine_list.${wine}.name`),
    slug: wine,
    description: t(`wine_list.${wine}.description`),
    tasting: t(`wine_list.${wine}.tasting`),
    conservation: t(`wine_list.${wine}.conservation`),
    suggestion: t(`wine_list.${wine}.suggestion`),
  }
})

const wineNames = wineInfo.map((wine) => wine.name)
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
  padding: 1rem;
  text-align: center;
  transition: transform 0.3s ease;
  background-color: #297e00;
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

</style>
