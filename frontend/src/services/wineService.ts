// src/services/wineService.ts
import { postRequest, putRequest, deleteRequest } from '@/services/axios'

/* ----------------------------- 🔸 RANGE ----------------------------- */

export async function createRange(data: {
  slug: string
  name: string
  description: string
}) {
  return await postRequest('/wine/range/create', data)
}

export async function updateRange(slug: string, data: {
  name?: string
  description?: string
}) {
  return await putRequest(`/wine/range/update/${slug}`, data)
}

export async function deleteRange(slug: string) {
  return await deleteRequest(`/wine/range/delete/${slug}`)
}

/* ----------------------------- 🍷 WINE ----------------------------- */

export async function createWine(data: {
  slug: string
  nativeName: string
  price: number
  rangeSlug: string
}) {
  return await postRequest('/wine/create', data)
}

export async function updateWine(slug: string, data: {
  nativeName?: string
  price?: number
  rangeSlug?: string
}) {
  return await putRequest(`/wine/update/${slug}`, data)
}

export async function deleteWine(slug: string) {
  return await deleteRequest(`/wine/delete/${slug}`)
}

/* ---------------------- 🌍 WINE TRANSLATION ------------------------ */

export async function createWineTranslation(data: {
  wineSlug: string
  languageCode: string
  name: string
  description: string
  tasting: string
  conservation: string
  suggestion: string
}) {
  return await postRequest('/wine/translation/create', data)
}

export async function updateWineTranslation(languageCode: string, wineSlug: string, data: {
  name?: string
  description?: string
  tasting?: string
  conservation?: string
  suggestion?: string
}) {
  return await putRequest(`/wine/translation/update/${languageCode}/${wineSlug}`, data)
}

export async function deleteWineTranslation(languageCode: string, wineSlug: string) {
  return await deleteRequest(`/wine/translation/delete/${languageCode}/${wineSlug}`)
}

/* ------------------ 🌐 RANGE TRANSLATION ------------------ */

export async function createRangeTranslation(data: {
  rangeSlug: string
  languageId: number
  name: string
  description: string
}) {
  return await postRequest('/wine/range/translation/create', data)
}

export async function updateRangeTranslation(id: number, data: {
  name?: string
  description?: string
}) {
  return await putRequest(`/wine/range/translation/update/${id}`, data)
}

export async function deleteRangeTranslation(id: number) {
  return await deleteRequest(`/wine/range/translation/delete/${id}`)
}
