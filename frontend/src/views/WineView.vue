<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section>
    <h1>{{ t('wine.title') }}</h1>
  </section>
</template>

<style scoped></style>
