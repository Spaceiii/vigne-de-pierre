import { boolean, integer, pgTable, text, varchar, timestamp, decimal } from 'drizzle-orm/pg-core'

const orderTable = pgTable("order", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").notNull().references(() => userTable.id),
    status: varchar("status", { length: 50 }).notNull().default('pending'),
    // précision for total_price is set to 10 digits before the decimal and 2 digits after
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    pickupInfo: text("pickup_info").notNull(),
    contactPhone: varchar("contact_phone", { length: 20 }).notNull(),
    contactEmail: varchar("contact_email", { length: 255 }).notNull(),
})

const orderItemTable = pgTable("order_item", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    orderId: integer("order_id").notNull().references(() => orderTable.id),
    wineSlug: varchar("wine_slug", { length: 255 }).notNull().references(() => wineTable.slug),
    quantity: integer("quantity").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
})

const rangeTable = pgTable("range", {
    slug: varchar("slug", { length: 255 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
})

const wineTable = pgTable("wine", {
    slug: varchar("slug", { length: 255 }).primaryKey(),
    nativeName: varchar("native_name", { length: 255 }).notNull().unique(),
    price: integer("price").notNull(),
    rangeSlug: varchar("range_slug", { length: 255 }).notNull().references(() => rangeTable.slug),
})

const languageTable = pgTable("language", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    code: varchar("code", { length: 255 }).notNull().unique(),
})

const wineTranslationTable = pgTable("translation", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    languageId: integer("language_id").notNull().references(() => languageTable.id),
    wineSlug: varchar("wine_slug", { length: 255 }).notNull().references(() => wineTable.slug),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    tasting: varchar("tasting", { length: 255 }).notNull(),
    conservation: varchar("conservation", { length: 255 }).notNull(),
    suggestion: varchar("suggestion", { length: 255 }).notNull(),
})

const rangeTranslationTable = pgTable("range_translation", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    languageId: integer("language_id").notNull().references(() => languageTable.id),
    rangeSlug: varchar("range_slug", { length: 255 }).notNull().references(() => rangeTable.slug),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
})

const userTable = pgTable("user", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    isAdmin: boolean("is_admin").notNull().default(false),
});

export {
    rangeTable,
    wineTable,
    languageTable,
    wineTranslationTable,
    rangeTranslationTable,
    userTable,
    orderTable,
    orderItemTable,
};
