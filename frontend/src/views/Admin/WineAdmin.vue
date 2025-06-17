<template>
  <div class="admin-wine-manager">
    <h1>Admin - Gestion des Vins (FR)</h1>

    <div v-if="loading">Chargement...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && !error">
      <div v-for="(range, rangeSlug) in winesByRange" :key="rangeSlug" class="range-block">
        <h2>{{ range.name }}</h2>
        <p>{{ range.description }}</p>

        <div v-for="wine in range.wines" :key="wine.wineSlug" class="wine-card">
          <h3>Vin : {{ wine.name }}</h3>

          <form @submit.prevent="saveTranslation(wine.wineSlug)">
            <label>
              Nom :
              <input v-model="translations[wine.wineSlug].name" required />
            </label>

            <label>
              Description :
              <textarea v-model="translations[wine.wineSlug].description" required></textarea>
            </label>

            <label>
              Dégustation :
              <input v-model="translations[wine.wineSlug].tasting" required />
            </label>

            <label>
              Conservation :
              <input v-model="translations[wine.wineSlug].conservation" required />
            </label>

            <label>
              Suggestion :
              <input v-model="translations[wine.wineSlug].suggestion" required />
            </label>

            <button type="submit" :disabled="saving[wine.wineSlug]">Enregistrer</button>
            <button type="button" @click="deleteTranslation(wine.wineSlug)" :disabled="saving[wine.wineSlug]">Supprimer</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { updateWineTranslation, deleteWineTranslation } from '@/services/wineService'
import { getWinesByLanguage } from '@/services/wineRequest.ts'
import type { WinesByRange, WineTranslation } from '@/types/wine'

const winesByRange = reactive<WinesByRange>({})
const translations = reactive<Record<string, WineTranslation>>({})
const loading = ref(true)
const error = ref<string | null>(null)
const saving = reactive<Record<string, boolean>>({})

const languageCode = 'fr' // langue par défaut

async function loadWines() {
  loading.value = true
  error.value = null
  try {
    const data = await getWinesByLanguage(languageCode)
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
    // updateWineTranslation(id, data)
    await updateWineTranslation(translation.id, {
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
    await deleteWineTranslation(translation.id)
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

onMounted(loadWines)
</script>


<style scoped>
.admin-wine-manager {
  padding: 1rem;
  max-width: 900px;
  margin: auto;
}
.range-block {
  margin-bottom: 2rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 1rem;
}
.wine-card {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  background: #f9f9f9;
}
form label {
  display: block;
  margin-bottom: 0.5rem;
}
form input, form textarea {
  width: 100%;
  box-sizing: border-box;
  margin-top: 0.2rem;
  margin-bottom: 0.8rem;
}
form button {
  margin-right: 0.5rem;
}
.error {
  color: red;
}
</style>
