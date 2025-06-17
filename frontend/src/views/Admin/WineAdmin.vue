<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  updateWineTranslation,
  deleteWineTranslation
} from '@/services/wineService'
import { getWinesByLanguage } from '@/services/wineRequest.ts'
import type { WinesByRange, WineTranslation } from '@/types/wine'

const { t } = useI18n()

const winesByRange = reactive<WinesByRange>({})
const translations = reactive<Record<string, WineTranslation>>({})
const loading = ref(true)
const error = ref<string | null>(null)
const saving = reactive<Record<string, boolean>>({})

const languageCode = ref('fr')

async function loadWines() {
  loading.value = true
  error.value = null
  try {
    const data = await getWinesByLanguage(languageCode.value)
    Object.assign(winesByRange, data)

    // Initialiser translations
    for (const rangeSlug in data) {
      data[rangeSlug].wines.forEach(wine => {
        translations[wine.wineSlug] = { ...wine }
        saving[wine.wineSlug] = false
      })
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur chargement vins'
  } finally {
    loading.value = false
  }
}

async function saveTranslation(wineSlug: string) {
  const translation = translations[wineSlug]
  if (!translation) return
  saving[wineSlug] = true

  try {
    await updateWineTranslation(languageCode.value, translation.wineSlug, {
      name: translation.name,
      description: translation.description,
      tasting: translation.tasting,
      conservation: translation.conservation,
      suggestion: translation.suggestion
    })
    alert(t('wine_admin.saved_successfully', { wine: wineSlug }))
  } catch (err: any) {
    alert(`${t('wine_admin.error_saving')}: ${err.message || err}`)
  } finally {
    saving[wineSlug] = false
  }
}

async function deleteTranslation(wineSlug: string) {
  const translation = translations[wineSlug]
  if (!translation) return
  if (!confirm(t('wine_admin.confirm_delete', { wine: wineSlug }))) return

  saving[wineSlug] = true
  try {
    await deleteWineTranslation(languageCode.value, wineSlug)
    alert(t('wine_admin.deleted_successfully', { wine: wineSlug }))
    delete translations[wineSlug]

    for (const rangeSlug in winesByRange) {
      winesByRange[rangeSlug].wines = winesByRange[rangeSlug].wines.filter(
        w => w.wineSlug !== wineSlug
      )
    }
  } catch (err: any) {
    alert(`${t('wine_admin.error_deleting')}: ${err.message || err}`)
  } finally {
    saving[wineSlug] = false
  }
}

onMounted(loadWines)
watch(languageCode, loadWines)
</script>

<template>
  <div class="admin-container">
    <h1 class="admin-title">{{ t('wine_admin.title') }}</h1>

    <div class="language-select">
      <label for="lang">{{ t('wine_admin.language') }}</label>
      <select id="lang" v-model="languageCode">
        <option value="fr">{{ t('wine_admin.lang_fr') }}</option>
        <option value="en">{{ t('wine_admin.lang_en') }}</option>
        <option value="jp">{{ t('wine_admin.lang_ja') }}</option>
      </select>
    </div>

    <div v-if="loading" class="admin-loading">
      {{ t('wine_admin.loading') }}
    </div>

    <div v-else-if="error" class="admin-error">
      {{ error }}
    </div>

    <div v-else>
      <div v-for="(range, rangeSlug) in winesByRange" :key="rangeSlug" class="range-block">
        <h2 class="range-title">{{ range.name }}</h2>

        <div
          v-for="wine in range.wines"
          :key="wine.wineSlug"
          class="wine-card"
        >
          <h3 class="wine-title">{{ wine.name }}</h3>

          <div class="form-grid">
            <div class="form-group">
              <label>{{ t('wine_admin.name') }}</label>
              <input v-model="translations[wine.wineSlug].name" />
            </div>

            <div class="form-group">
              <label>{{ t('wine_admin.description') }}</label>
              <textarea v-model="translations[wine.wineSlug].description" />
            </div>

            <div class="form-group">
              <label>{{ t('wine_admin.tasting') }}</label>
              <textarea v-model="translations[wine.wineSlug].tasting" />
            </div>

            <div class="form-group">
              <label>{{ t('wine_admin.conservation') }}</label>
              <textarea v-model="translations[wine.wineSlug].conservation" />
            </div>

            <div class="form-group full">
              <label>{{ t('wine_admin.suggestion') }}</label>
              <textarea v-model="translations[wine.wineSlug].suggestion" />
            </div>
          </div>

          <div class="action-buttons">
            <button
              class="btn save"
              @click="saveTranslation(wine.wineSlug)"
              :disabled="saving[wine.wineSlug]"
            >
              {{ t('wine_admin.save') }}
            </button>
            <button
              class="btn delete"
              @click="deleteTranslation(wine.wineSlug)"
              :disabled="saving[wine.wineSlug]"
            >
              {{ t('wine_admin.delete') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  padding: 2rem;
  max-width: 960px;
  margin: auto;
  font-family: system-ui, sans-serif;
}

.admin-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.language-select {
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.language-select select {
  padding: 0.4rem 0.6rem;
  font-size: 1rem;
}

.admin-loading,
.admin-error {
  margin: 2rem 0;
  font-weight: bold;
}

.admin-error {
  color: red;
}

.range-block {
  margin-bottom: 3rem;
}

.range-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
}

.wine-card {
  background: #f9f9f9;
  padding: 1.2rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.wine-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full {
  grid-column: span 2;
}

input, textarea {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

textarea {
  min-height: 60px;
  resize: vertical;
}

.action-buttons {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn.save {
  background-color: #2563eb;
  color: white;
}

.btn.delete {
  background-color: #dc2626;
  color: white;
}
</style>
