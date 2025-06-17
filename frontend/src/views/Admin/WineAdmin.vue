<template>
  <div class="wine-admin">
    <div class="admin-header">
      <h1 class="admin-title">{{ $t('wine_admin.title') }}</h1>
      <button
        @click="showCreateForm = !showCreateForm"
        class="btn btn-primary"
        :class="{ 'btn-secondary': showCreateForm }"
      >
        <span class="btn-icon">{{ showCreateForm ? '−' : '+' }}</span>
        {{ showCreateForm ? $t('wine_admin.hide_create_form') : $t('wine_admin.show_create_form') }}
      </button>
    </div>

    <div v-if="showCreateForm" class="create-form-container">
      <WineCreateForm @wine-created="reloadWines" />
    </div>

    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <span>Chargement des vins...</span>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-message">
        <span class="error-icon">⚠️</span>
        {{ error }}
      </div>
    </div>

    <div v-else class="wines-container">
      <div
        v-for="(range, rangeSlug) in winesByRange"
        :key="rangeSlug"
        class="range-accordion"
      >
        <div
          class="range-header"
          @click="toggleRange(rangeSlug)"
          :class="{ 'active': expandedRanges[rangeSlug] }"
        >
          <div class="range-info">
            <h2 class="range-title">{{ range.name }}</h2>
            <p class="range-description">{{ range.description }}</p>
            <span class="wine-count">{{ range.wines.length }} vin(s)</span>
          </div>
          <div class="accordion-icon">
            <svg
              :class="{ 'rotated': expandedRanges[rangeSlug] }"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>

        <div
          class="range-content"
          :class="{ 'expanded': expandedRanges[rangeSlug] }"
        >
          <div class="wines-grid">
            <div
              v-for="wine in range.wines"
              :key="wine.wineSlug"
              class="wine-card"
            >
              <div class="wine-card-header">
                <h3 class="wine-name">{{ wine.name }}</h3>
                <span class="wine-slug">{{ wine.wineSlug }}</span>
              </div>

              <form @submit.prevent="saveTranslation(wine.wineSlug)" class="wine-form">
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">{{ $t('wine_admin.name') }}</label>
                    <input
                      v-model="translations[wine.wineSlug].name"
                      class="form-input"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">{{ $t('wine_admin.description') }}</label>
                  <textarea
                    v-model="translations[wine.wineSlug].description"
                    class="form-textarea"
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">{{ $t('wine_admin.tasting') }}</label>
                    <textarea
                      v-model="translations[wine.wineSlug].tasting"
                      class="form-textarea"
                      rows="2"
                      required
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label class="form-label">{{ $t('wine_admin.conservation') }}</label>
                    <textarea
                      v-model="translations[wine.wineSlug].conservation"
                      class="form-textarea"
                      rows="2"
                      required
                    ></textarea>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">{{ $t('wine_admin.suggestion') }}</label>
                  <textarea
                    v-model="translations[wine.wineSlug].suggestion"
                    class="form-textarea"
                    rows="2"
                    required
                  ></textarea>
                </div>

                <div class="form-actions">
                  <button
                    type="submit"
                    class="btn btn-success"
                    :disabled="saving[wine.wineSlug]"
                  >
                    <span v-if="saving[wine.wineSlug]" class="spinner-sm"></span>
                    {{ saving[wine.wineSlug] ? 'Sauvegarde...' : $t('wine_admin.save') }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    @click="deleteTranslation(wine.wineSlug)"
                    :disabled="saving[wine.wineSlug]"
                  >
                    {{ $t('wine_admin.delete') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
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
const expandedRanges = reactive<Record<string, boolean>>({})
const loading = ref(true)
const error = ref<string | null>(null)
const saving = reactive<Record<string, boolean>>({})

const languageCode = ref('fr')
const showCreateForm = ref(false)

function toggleRange(rangeSlug: string) {
  expandedRanges[rangeSlug] = !expandedRanges[rangeSlug]
}

async function loadWines() {
  loading.value = true
  error.value = null
  try {
    const data = await getWinesByLanguage(languageCode.value)
    Object.assign(winesByRange, data)

    // Initialize expanded state and translations
    for (const rangeSlug in data) {
      expandedRanges[rangeSlug] = true // Expand first range by default
      data[rangeSlug].wines.forEach(wine => {
        translations[wine.wineSlug] = { ...wine }
        saving[wine.wineSlug] = false
      })
    }
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement des vins'
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

    // Success notification could be improved with a toast system
    alert(`✅ Traduction du vin ${wineSlug} mise à jour avec succès.`)
  } catch (err: any) {
    alert(`❌ Erreur lors de la sauvegarde : ${err.message || err}`)
  } finally {
    saving[wineSlug] = false
  }
}

async function deleteTranslation(wineSlug: string) {
  const translation = translations[wineSlug]
  if (!translation) return

  if (!confirm(`⚠️ Confirmez-vous la suppression définitive du vin "${translation.name}" ?`)) {
    return
  }

  saving[wineSlug] = true
  try {
    await deleteWine(wineSlug)
    alert(`✅ Vin ${wineSlug} supprimé avec succès.`)

    // Remove from local state
    delete translations[wineSlug]
    for (const rangeSlug in winesByRange) {
      winesByRange[rangeSlug].wines = winesByRange[rangeSlug].wines.filter(
        w => w.wineSlug !== wineSlug
      )
    }
  } catch (err: any) {
    alert(`❌ Erreur lors de la suppression : ${err.message || err}`)
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
.wine-admin {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fafafa;
  min-height: 100vh;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.admin-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-success {
  background-color: #27ae60;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #229954;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c0392b;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.create-form-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e0e0e0;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-sm {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  padding: 2rem;
  text-align: center;
}

.error-message {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #fff5f5;
  color: #e53e3e;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border: 1px solid #fed7d7;
}

.wines-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.range-accordion {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.range-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.range-header:hover {
  background-color: #f8f9fa;
}

.range-header.active {
  background-color: #f1f8ff;
}

.range-info {
  flex: 1;
}

.range-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.range-description {
  color: #7f8c8d;
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
}

.wine-count {
  display: inline-block;
  background-color: #e8f4fd;
  color: #3498db;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.accordion-icon {
  color: #7f8c8d;
  transition: transform 0.2s ease;
}

.accordion-icon .rotated {
  transform: rotate(180deg);
}

.range-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.range-content.expanded {
  max-height: 5000px;
}

.wines-grid {
  padding: 1rem 2rem 2rem;
  display: grid;
  gap: 1.5rem;
}

.wine-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.2s ease;
}

.wine-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.wine-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.wine-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.wine-slug {
  background-color: #e9ecef;
  color: #6c757d;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: monospace;
}

.wine-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

@media (max-width: 768px) {
  .wine-admin {
    padding: 1rem;
  }

  .admin-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .admin-title {
    font-size: 2rem;
    text-align: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .range-header {
    padding: 1rem;
  }

  .wines-grid {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
