import { relations } from "drizzle-orm/relations";
import { language, translation, wine, range, rangeTranslation } from "./schema";

export const translationRelations = relations(translation, ({one}) => ({
	language: one(language, {
		fields: [translation.languageId],
		references: [language.id]
	}),
	wine: one(wine, {
		fields: [translation.wineSlug],
		references: [wine.slug]
	}),
}));

export const languageRelations = relations(language, ({many}) => ({
	translations: many(translation),
	rangeTranslations: many(rangeTranslation),
}));

export const wineRelations = relations(wine, ({one, many}) => ({
	translations: many(translation),
	range: one(range, {
		fields: [wine.rangeSlug],
		references: [range.slug]
	}),
}));

export const rangeRelations = relations(range, ({many}) => ({
	wines: many(wine),
	rangeTranslations: many(rangeTranslation),
}));

export const rangeTranslationRelations = relations(rangeTranslation, ({one}) => ({
	language: one(language, {
		fields: [rangeTranslation.languageId],
		references: [language.id]
	}),
	range: one(range, {
		fields: [rangeTranslation.rangeSlug],
		references: [range.slug]
	}),
}));