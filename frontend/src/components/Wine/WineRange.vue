<template>
  <div class="wine-range" :id>
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

      <p v-if="wineNames">
        <strong>Nos vins : </strong>
        <template v-for="wine in wineNames.slice(0, wineNames.length - 1)" :key="wine">
          {{ wine }},
        </template>
        {{ wineNames[wineNames.length - 1] }}
      </p>

      <router-link to="/wine" class="btn">
        <button class="btn btn-primary">{{ t('wine.range_details') }}</button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const {
  id,
  title,
  imageSrc,
  imageAlt,
  description,
  wineNames
} = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  imageSrc: { type: String, required: true },
  imageAlt: { type: String, required: true },
  description: { type: String, required: true },
  wineNames: {
    type: Array<String>,
    required: false,
  },
})
</script>

<style scoped>
.wine-range {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 4rem 8rem;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.wine-range:nth-child(even) {
  flex-direction: row-reverse;
}

.wine-range:hover {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  transform: scale(1.02);
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
  margin-bottom: 3rem;
}

.btn {
  margin-top: 3rem;
  font-size: 1rem;
  background-color: #297e00;
  color: white;
  padding: .7rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn:hover {
  background-color: #1d5e00;
}
</style>
