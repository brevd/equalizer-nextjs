import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getCategories } from "@/lib/api/categories/queries";

import { nanoid } from "@/lib/utils";


export const categories = sqliteTable('categories', {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  description: text("description").notNull()
});


// Schema for categories - used to validate API requests
const baseSchema = createSelectSchema(categories)

export const insertCategorySchema = createInsertSchema(categories);
export const insertCategoryParams = baseSchema.extend({}).omit({ 
  id: true
});

export const updateCategorySchema = baseSchema;
export const updateCategoryParams = baseSchema.extend({})
export const categoryIdSchema = baseSchema.pick({ id: true });

// Types for categories - used to type API request params and within Components
export type Category = typeof categories.$inferSelect;
export type NewCategory = z.infer<typeof insertCategorySchema>;
export type NewCategoryParams = z.infer<typeof insertCategoryParams>;
export type UpdateCategoryParams = z.infer<typeof updateCategoryParams>;
export type CategoryId = z.infer<typeof categoryIdSchema>["id"];
    
// this type infers the return from getCategories() - meaning it will include any joins
export type CompleteCategory = Awaited<ReturnType<typeof getCategories>>["categories"][number];

