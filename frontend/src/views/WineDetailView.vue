<template>
  <section class="wrapper">
    <div class="box">
      <img :src="image" :alt="range">
    </div>

    <div class="content">
      <h1>{{ name }}</h1>
      <p>{{ description }}</p>
      <p><strong>Dégustation :</strong> {{ tasting }}</p>
      <p><strong>Conservation :</strong> {{ conservation }}</p>
      <p><strong>Suggestion :</strong> {{ suggestion }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from 'vue-i18n'

import ImagePierreries from '@/assets/wine_range/pierreries-big.jpg'
import ImagePierresPrecieuses from '@/assets/wine_range/pierres_precieuses-big.jpg'
import ImageGrandsCrus from '@/assets/wine_range/grands_crus-big.jpg'
import ImageVendangesTardives from '@/assets/wine_range/vendanges_tardives-big.jpg'

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

const image = ref('')

if (range === 'pierreries') {
  image.value = ImagePierreries
} else if (range === 'pierres_precieuses') {
  image.value = ImagePierresPrecieuses
} else if (range === 'grands_crus') {
  image.value = ImageGrandsCrus
} else if (range === 'vendanges_tardives') {
  image.value = ImageVendangesTardives
} else {
  console.error(`Unknown wine range: ${range}`)
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
  margin: 2rem auto;
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
</style>
