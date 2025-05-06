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

      <p>
        <template v-for="wine in wineNames" :key="wine">
          {{ wine }},
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  id,
  title,
  imageSrc,
  imageAlt,
  description,
  wineNames
} = defineProps({
  id: String,
  title: String,
  imageSrc: String,
  imageAlt: String,
  description: String,
  wineNames: Array<String>,
})
</script>

<style scoped>

</style>
