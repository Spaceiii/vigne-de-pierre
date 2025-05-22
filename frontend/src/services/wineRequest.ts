import { getRequest, postRequest, putRequest, deleteRequest } from '@/services/axios.ts'

import type { Wine, WineTranslation, WinesByRange } from '@/types/wine.ts'

async function getWines(): Promise<Wine[]> {
  const { data, error, status } = await getRequest('/wine/all_wines')
  if (error) {
    throw new Error('Error fetching wines')
  }
  return data
}

async function getTranslationWine(slug: string, languageCode: string): Promise<WineTranslation> {
  const { data, error, status } = await getRequest(`/wine/translation/${languageCode}/${slug}`)
  if (error) {
    throw new Error(`Error fetching wine translation for language ${languageCode}`)
  }
  return data
}


async function getWine(slug: string): Promise<Wine> {
  const { data, error, status } = await getRequest(`/wine/details/${slug}`)
  if (error) {
    throw new Error('Error fetching wine')
  }
  return data
}


async function postWine(wine: Wine): Promise<Wine> {
  const { data, error, status } = await postRequest('/wine/create', wine)
  if (error) {
    throw new Error('Error creating wine')
  }
  return data
}

/**
 * Fetches all wines with translations for a specific language, grouped by range
 *
 * @param languageCode - The language code (e.g., 'fr', 'en', 'jp')
 * @returns A promise that resolves to an object where keys are range slugs and values are objects containing range information and an array of wine objects
 * @example
 * // Get all wines with French translations
 * const frenchWines = await getWinesByLanguage('fr');
 *
 * // Access range information and wines in a specific range
 * const pierreries = frenchWines.pierreries;
 * console.log(`Range: ${pierreries.name}`);
 * console.log(`Description: ${pierreries.description}`);
 *
 * // Iterate through all ranges
 * for (const [rangeSlug, rangeData] of Object.entries(frenchWines)) {
 *   console.log(`Range: ${rangeData.name}`);
 *   console.log(`Description: ${rangeData.description}`);
 *   rangeData.wines.forEach(wine => {
 *     console.log(`- ${wine.name}: ${wine.description}`);
 *   });
 * }
 */
async function getWinesByLanguage(languageCode: string): Promise<WinesByRange> {
  const { data, error } = await getRequest(`/wine/translation/${languageCode}`)
  if (error) {
    throw new Error(`Error fetching wines for language ${languageCode}`)
  }
  return data
}

export {
  getWines,
  getWine,
  getTranslationWine,
  postWine,
  getWinesByLanguage,
}
