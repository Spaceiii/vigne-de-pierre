<template>
  <div class="admin-page">
    <h1>{{ $t('wine_admin.title') }}</h1>

    <button @click="showCreateForm = !showCreateForm" class="toggle-btn">
      {{ showCreateForm ? $t('wine_admin.hide_create_form') : $t('wine_admin.show_create_form') }}
    </button>

    <WineCreateForm v-if="showCreateForm" @wine-created="reloadWines" />

    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="(range, rangeSlug) in winesByRange" :key="rangeSlug" class="range-section">
        <h2>{{ range.name }}</h2>
        <p>{{ range.description }}</p>

        <div v-for="wine in range.wines" :key="wine.wineSlug" class="wine-card">
          <form @submit.prevent="saveTranslation(wine.wineSlug)">
            <div class="form-group">
              <label>{{ $t('wine_admin.name') }}</label>
              <input v-model="translations[wine.wineSlug].name" required />
            </div>
            <div class="form-group">
              <label>{{ $t('wine_admin.description') }}</label>
              <textarea v-model="translations[wine.wineSlug].description" required></textarea>
            </div>
            <div class="form-group">
              <label>{{ $t('wine_admin.tasting') }}</label>
              <textarea v-model="translations[wine.wineSlug].tasting" required></textarea>
            </div>
            <div class="form-group">
              <label>{{ $t('wine_admin.conservation') }}</label>
              <textarea v-model="translations[wine.wineSlug].conservation" required></textarea>
            </div>
            <div class="form-group">
              <label>{{ $t('wine_admin.suggestion') }}</label>
              <textarea v-model="translations[wine.wineSlug].suggestion" required></textarea>
            </div>

            <div class="actions">
              <button type="submit" :disabled="saving[wine.wineSlug]">
                {{ $t('wine_admin.save') }}
              </button>
              <button type="button" class="delete-btn" @click="deleteTranslation(wine.wineSlug)">
                {{ $t('wine_admin.delete') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { updateWineTranslation, deleteWine } from '@/services/wineService'
import { getWinesByLanguage } from '@/services/wineRequest.ts'
import type { WinesByRange, WineTranslation } from '@/types/wine'
import WineCreateForm from '@/components/Wine/WineCreateForm.vue'

const winesByRange = reactive<WinesByRange>({})
const translations = reactive<Record<string, WineTranslation>>({})
const loading = ref(true)
const error = ref<string | null>(null)
const saving = reactive<Record<string, boolean>>({})

const languageCode = ref('fr')
const showCreateForm = ref(false)

async function loadWines() {
  loading.value = true
  error.value = null
  try {
    const data = await getWinesByLanguage(languageCode.value)
    Object.assign(winesByRange, data)

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
    alert(`Traduction du vin ${wineSlug} mise à jour.`)
  } catch (err: any) {
    alert(`Erreur sauvegarde traduction : ${err.message || err}`)
  } finally {
    saving[wineSlug] = false
  }
}

async function deleteTranslation(wineSlug: string) {
  const translation = translations[wineSlug]
  if (!translation) return
  if (!confirm(`Confirmez-vous la suppression de la traduction du vin ${wineSlug} ?`)) return

  saving[wineSlug] = true
  try {
    await deleteWine(wineSlug)
    alert(`Traduction du vin ${wineSlug} supprimée.`)
    delete translations[wineSlug]

    for (const rangeSlug in winesByRange) {
      winesByRange[rangeSlug].wines = winesByRange[rangeSlug].wines.filter(w => w.wineSlug !== wineSlug)
    }
  } catch (err: any) {
    alert(`Erreur suppression traduction : ${err.message || err}`)
  } finally {
    saving[wineSlug] = false
  }
}

function reloadWines() {
  showCreateForm.value = false
  loadWines()
}

onMounted(loadWines)
</script>

<style scoped>
.admin-page {
  padding: 1.5rem;
}

.toggle-btn {
  margin: 1rem 0;
  padding: 0.6rem 1rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.range-section {
  margin-top: 2rem;
}

.wine-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: vertical;
}

.actions {
  display: flex;
  gap: 1rem;
}

.actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.actions .delete-btn {
  background-color: #e53935;
  color: white;
}
</style>
