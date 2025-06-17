<template>
  <div class="wine-create-form">
    <div class="form-header">
      <h2 class="form-title">{{ $t('wine_admin.create_new_wine') }}</h2>
      <p class="form-subtitle">Créez un nouveau vin avec ses traductions</p>
    </div>

    <form @submit.prevent="handleSubmit" class="create-form">
      <!-- Informations générales -->
      <div class="form-section">
        <h3 class="section-title">Informations générales</h3>

        <div class="form-row">
          <div class="form-group">
            <label for="slug" class="form-label required">{{ $t('wine_admin.slug') }}</label>
            <input
              v-model="wine.slug"
              id="slug"
              class="form-input"
              placeholder="ex: rouge-reserve-2020"
              required
            />
            <span class="form-hint">Identifiant unique du vin (sans espaces)</span>
          </div>

          <div class="form-group">
            <label for="price" class="form-label required">{{ $t('wine_admin.price') }}</label>
            <div class="input-group">
              <input
                v-model.number="wine.price"
                id="price"
                class="form-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
              <span class="input-suffix">€</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="range" class="form-label required">{{ $t('wine_admin.range') }}</label>
          <div class="select-wrapper">
            <select v-model="wine.rangeSlug" id="range" class="form-select" required>
              <option disabled value="">{{ $t('wine_admin.select_range') }}</option>
              <option v-for="range in ranges" :key="range.slug" :value="range.slug">
                {{ range.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Traductions -->
      <div class="form-section">
        <h3 class="section-title">Traductions</h3>

        <div class="translations-container">
          <div
            v-for="lang in languages"
            :key="lang.code"
            class="translation-card"
            :class="{ 'active': activeLanguage === lang.code }"
          >
            <div
              class="translation-header"
              @click="activeLanguage = activeLanguage === lang.code ? '' : lang.code"
            >
              <div class="language-info">
                <span class="language-flag">{{ getLanguageFlag(lang.code) }}</span>
                <span class="language-name">{{ lang.label }}</span>
              </div>
              <div class="expand-icon" :class="{ 'rotated': activeLanguage === lang.code }">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </div>
            </div>

            <div
              class="translation-content"
              :class="{ 'expanded': activeLanguage === lang.code }"
            >
              <div class="translation-fields">
                <div class="form-group">
                  <label :for="`name-${lang.code}`" class="form-label required">
                    {{ $t('wine_admin.name') }}
                  </label>
                  <input
                    v-model="translations[lang.code].name"
                    :id="`name-${lang.code}`"
                    class="form-input"
                    :placeholder="`Nom du vin en ${lang.label.toLowerCase()}`"
                    required
                  />
                </div>

                <div class="form-group">
                  <label :for="`description-${lang.code}`" class="form-label required">
                    {{ $t('wine_admin.description') }}
                  </label>
                  <textarea
                    v-model="translations[lang.code].description"
                    :id="`description-${lang.code}`"
                    class="form-textarea"
                    rows="3"
                    :placeholder="`Description générale en ${lang.label.toLowerCase()}`"
                    required
                  />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label :for="`tasting-${lang.code}`" class="form-label required">
                      {{ $t('wine_admin.tasting') }}
                    </label>
                    <textarea
                      v-model="translations[lang.code].tasting"
                      :id="`tasting-${lang.code}`"
                      class="form-textarea"
                      rows="2"
                      :placeholder="`Notes de dégustation en ${lang.label.toLowerCase()}`"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label :for="`conservation-${lang.code}`" class="form-label required">
                      {{ $t('wine_admin.conservation') }}
                    </label>
                    <textarea
                      v-model="translations[lang.code].conservation"
                      :id="`conservation-${lang.code}`"
                      class="form-textarea"
                      rows="2"
                      :placeholder="`Conseils de conservation en ${lang.label.toLowerCase()}`"
                      required
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label :for="`suggestion-${lang.code}`" class="form-label required">
                    {{ $t('wine_admin.suggestion') }}
                  </label>
                  <textarea
                    v-model="translations[lang.code].suggestion"
                    :id="`suggestion-${lang.code}`"
                    class="form-textarea"
                    rows="2"
                    :placeholder="`Suggestions d'accompagnement en ${lang.label.toLowerCase()}`"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button
          type="submit"
          class="btn btn-primary btn-large"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner"></span>
          <span v-else class="btn-icon">✓</span>
          {{ loading ? 'Création en cours...' : $t('wine_admin.save') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { postWine } from '@/services/wineRequest'
import { createWineTranslation } from '@/services/wineService'
import { getRequest } from '@/services/axios'

const emit = defineEmits<{
  'wine-created': []
}>()

const wine = reactive({
  slug: '',
  rangeSlug: '',
  price: 0
})

const ranges = ref<{ slug: string; name: string }[]>([])
const loading = ref(false)
const activeLanguage = ref('fr')

const languages = [
  { code: 'fr', label: 'Français', languageId: 1 },
  { code: 'en', label: 'English', languageId: 2 },
  { code: 'jp', label: '日本語', languageId: 3 }
] as const

const translations = reactive<Record<string, any>>({
  fr: { name: '', description: '', tasting: '', conservation: '', suggestion: '' },
  en: { name: '', description: '', tasting: '', conservation: '', suggestion: '' },
  jp: { name: '', description: '', tasting: '', conservation: '', suggestion: '' }
})

function getLanguageFlag(code: string): string {
  const flags = {
    fr: '🇫🇷',
    en: '🇬🇧',
    jp: '🇯🇵'
  }
  return flags[code as keyof typeof flags] || '🌐'
}

function validateForm(): boolean {
  // Validation basique
  if (!wine.slug || !wine.rangeSlug || wine.price < 0) {
    alert('❌ Veuillez remplir tous les champs obligatoires.')
    return false
  }

  // Vérifier que toutes les traductions sont complètes
  for (const lang of languages) {
    const translation = translations[lang.code]
    if (!translation.name || !translation.description || !translation.tasting ||
      !translation.conservation || !translation.suggestion) {
      alert(`❌ Veuillez compléter tous les champs pour la langue ${lang.label}.`)
      return false
    }
  }

  return true
}

async function handleSubmit() {
  if (!validateForm()) return

  loading.value = true

  try {
    // Créer le vin principal
    await postWine({
      slug: wine.slug,
      name: translations.fr.name,
      description: translations.fr.description,
      nativeName: translations.fr.name,
      price: wine.price,
      rangeSlug: wine.rangeSlug
    })

    // Créer les traductions
    for (const lang of languages) {
      await createWineTranslation({
        wineSlug: wine.slug,
        languageCode: lang.code,
        ...translations[lang.code]
      })
    }

    alert('✅ Vin créé avec succès !')

    // Reset form
    resetForm()
    emit('wine-created')

  } catch (err: any) {
    console.error('Erreur création vin:', err)
    alert(`❌ Erreur lors de la création : ${err.message || err}`)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  wine.slug = ''
  wine.rangeSlug = ''
  wine.price = 0

  for (const lang of languages) {
    translations[lang.code] = {
      name: '',
      description: '',
      tasting: '',
      conservation: '',
      suggestion: ''
    }
  }

  activeLanguage.value = 'fr'
}

onMounted(async () => {
  try {
    const { data, error } = await getRequest('/wine/all_ranges')
    if (!error && data) {
      ranges.value = data
    }
  } catch (err) {
    console.error('Erreur chargement gammes:', err)
  }
})
</script>

<style scoped>
.wine-create-form {
  max-width: 900px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.form-subtitle {
  color: #7f8c8d;
  font-size: 1rem;
  margin: 0;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e8f4fd;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
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

.form-label.required::after {
  content: ' *';
  color: #e74c3c;
}

.form-input,
.form-textarea,
.form-select {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  background-color: white;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.form-hint {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-top: 0.25rem;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-suffix {
  position: absolute;
  right: 0.75rem;
  color: #7f8c8d;
  font-weight: 600;
  pointer-events: none;
}

.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.translations-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.translation-card {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.translation-card.active {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.translation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.translation-header:hover {
  background-color: #e9ecef;
}

.translation-card.active .translation-header {
  background-color: #e8f4fd;
}

.language-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.language-flag {
  font-size: 1.2rem;
}

.language-name {
  font-weight: 600;
  color: #2c3e50;
}

.expand-icon {
  color: #7f8c8d;
  transition: transform 0.2s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.translation-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.translation-content.expanded {
  max-height: 1000px;
}

.translation-fields {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-actions {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
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

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-1px);
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  font-size: 1.1rem;
}

.spinner {
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

@media (max-width: 768px) {
  .wine-create-form {
    padding: 0;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-section {
    padding: 1rem;
    margin: 0 0.5rem;
  }

  .translation-header {
    padding: 0.75rem 1rem;
  }

  .translation-fields {
    padding: 1rem;
  }
}
</style>
