<template>
  <div class="wine-form">
    <h2 class="title">{{ $t('wine_admin.create_new_wine') }}</h2>

    <form @submit.prevent="handleSubmit">
      <!-- Slug -->
      <div class="form-group">
        <label for="slug">{{ $t('wine_admin.slug') }}</label>
        <input v-model="wine.slug" id="slug" required />
      </div>

      <!-- Gamme -->
      <div class="form-group">
        <label for="range">{{ $t('wine_admin.range') }}</label>

        <select v-model="wine.rangeSlug" id="range" required>
          <option disabled value="">{{ $t('wine_admin.select_range') }}</option>
          <option v-for="range in ranges" :key="range.slug" :value="range.slug">
            {{ range.name }}
          </option>
        </select>
      </div>

      <!-- Prix -->
      <div class="form-group">
        <label for="price">{{ $t('wine_admin.price') }}</label>
        <input v-model.number="wine.price" id="price" type="number" min="0" step="0.01" required />
      </div>

      <!-- Traductions -->
      <div v-for="lang in languages" :key="lang.code" class="translation-block">
        <h3>{{ $t(`wine_admin.translation`) }}: {{ lang.label }}</h3>
        <div class="form-group">
          <label :for="`name-${lang.code}`">{{ $t('wine_admin.name') }}</label>
          <input v-model="translations[lang.code].name" :id="`name-${lang.code}`" required />
        </div>
        <div class="form-group">
          <label :for="`description-${lang.code}`">{{ $t('wine_admin.description') }}</label>
          <textarea v-model="translations[lang.code].description" :id="`description-${lang.code}`" required />
        </div>
        <div class="form-group">
          <label :for="`tasting-${lang.code}`">{{ $t('wine_admin.tasting') }}</label>
          <textarea v-model="translations[lang.code].tasting" :id="`tasting-${lang.code}`" required />
        </div>
        <div class="form-group">
          <label :for="`conservation-${lang.code}`">{{ $t('wine_admin.conservation') }}</label>
          <textarea v-model="translations[lang.code].conservation" :id="`conservation-${lang.code}`" required />
        </div>
        <div class="form-group">
          <label :for="`suggestion-${lang.code}`">{{ $t('wine_admin.suggestion') }}</label>
          <textarea v-model="translations[lang.code].suggestion" :id="`suggestion-${lang.code}`" required />
        </div>
      </div>

      <button type="submit" :disabled="loading">
        {{ $t('wine_admin.save') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { postWine } from '@/services/wineRequest'
import { createWineTranslation } from '@/services/wineService'
import { getRequest } from '@/services/axios'

const wine = reactive({
  slug: '',
  rangeSlug: '',
  price: 0
})

const emit = defineEmits(['wine-created'])

const ranges = ref<{ slug: string; name: string }[]>([])
const loading = ref(false)

const languages = [
  { code: 'fr', label: 'Français', languageId: 1 },
  { code: 'en', label: 'English', languageId: 2 },
  { code: 'jp', label: '日本語', languageId: 3 }
]

const translations = reactive<Record<string, any>>({
  fr: { name: '', description: '', tasting: '', conservation: '', suggestion: '' },
  en: { name: '', description: '', tasting: '', conservation: '', suggestion: '' },
  jp: { name: '', description: '', tasting: '', conservation: '', suggestion: '' }
})

async function handleSubmit() {
  loading.value = true

  try {
    console.log(translations)

    await postWine({
      slug: wine.slug,
      name: translations.fr.name,
      description: translations.fr.description,
      nativeName: translations.fr.name,
      price: wine.price,
      rangeSlug: wine.rangeSlug
    })

    for (const lang of languages) {
      await createWineTranslation({
        wineSlug: wine.slug,
        languageCode: lang.code,
        ...translations[lang.code]
      })
    }

    alert('✅ Vin créé avec succès !')

    emit('wine-created')
  } catch (err: any) {
    alert(`❌ Erreur lors de la création : ${err.message || err}`)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const { data, error } = await getRequest('/wine/all_ranges')
  if (!error) ranges.value = data
})
</script>

<style scoped>
.wine-form {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
}
.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
textarea,
input,
select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
button {
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.translation-block {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fafafa;
}
</style>
