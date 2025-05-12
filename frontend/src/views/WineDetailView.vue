<template>

</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const { id } = defineProps({
  id: { type: String, required: true },
})
</script>

<style scoped>

</style>
