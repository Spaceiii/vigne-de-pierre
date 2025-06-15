import { pgTable, unique, integer, varchar, foreignKey, text } from "drizzle-orm/pg-core"

export const language = pgTable("language", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "language_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
	code: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("language_code_unique").on(table.code),
]);

export const translation = pgTable("translation", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "translation_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	languageId: integer("language_id").notNull(),
	wineSlug: varchar("wine_slug", { length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	tasting: varchar({ length: 255 }).notNull(),
	conservation: varchar({ length: 255 }).notNull(),
	suggestion: varchar({ length: 255 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.languageId],
			foreignColumns: [language.id],
			name: "translation_language_id_language_id_fk"
		}),
	foreignKey({
			columns: [table.wineSlug],
			foreignColumns: [wine.slug],
			name: "translation_wine_slug_wine_slug_fk"
		}),
]);

export const range = pgTable("range", {
	name: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
	slug: varchar({ length: 255 }).primaryKey().notNull(),
});

export const wine = pgTable("wine", {
	slug: varchar({ length: 255 }).primaryKey().notNull(),
	nativeName: varchar("native_name", { length: 255 }).notNull(),
	price: integer().notNull(),
	rangeSlug: varchar("range_slug", { length: 255 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.rangeSlug],
			foreignColumns: [range.slug],
			name: "wine_range_slug_range_slug_fk"
		}),
	unique("wine_native_name_unique").on(table.nativeName),
]);

export const rangeTranslation = pgTable("range_translation", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "range_translation_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	languageId: integer("language_id").notNull(),
	rangeSlug: varchar("range_slug", { length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.languageId],
			foreignColumns: [language.id],
			name: "range_translation_language_id_language_id_fk"
		}),
	foreignKey({
			columns: [table.rangeSlug],
			foreignColumns: [range.slug],
			name: "range_translation_range_slug_range_slug_fk"
		}),
]);
