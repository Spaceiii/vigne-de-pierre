<template>
  <div class="not-found">
    <h1>{{ t('notFound.title') }}</h1>
    <h2>{{ t('notFound.message') }}</h2>
  </div>
</template>

<style scoped>

</style>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
