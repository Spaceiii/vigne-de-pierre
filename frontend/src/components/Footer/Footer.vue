<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
<footer class="footer">
  <h1 class="prevention">{{ t('footer.prevention') }}</h1>
</footer>
</template>

<style scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: linear-gradient(to right, var(--primary-bg-start), var(--primary-bg-end));
  color: white;
  font-size: .7rem;
  height: var(--footer-height);
}
</style>
