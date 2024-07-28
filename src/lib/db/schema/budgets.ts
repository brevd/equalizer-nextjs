import { sql } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { categories } from "./categories";
import { type getBudgets } from "@/lib/api/budgets/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const budgets = sqliteTable("budgets", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  amount: integer("amount").notNull(),
  period: integer("period"),
  categoryId: text("category_id")
    .references(() => categories.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id").notNull(),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Schema for budgets - used to validate API requests
const baseSchema = createSelectSchema(budgets).omit(timestamps);

export const insertBudgetSchema = createInsertSchema(budgets).omit(timestamps);
export const insertBudgetParams = baseSchema
  .extend({
    amount: z.coerce.number(),
    period: z.coerce.number().nullable().default(null),
    categoryId: z.coerce.string().min(1),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateBudgetSchema = baseSchema;
export const updateBudgetParams = baseSchema
  .extend({
    amount: z.coerce.number(),
    period: z.coerce.number().nullable().default(null),
    categoryId: z.coerce.string().min(1),
  })
  .omit({
    userId: true,
  });
export const budgetIdSchema = baseSchema.pick({ id: true });

// Types for budgets - used to type API request params and within Components
export type Budget = typeof budgets.$inferSelect;
export type NewBudget = z.infer<typeof insertBudgetSchema>;
export type NewBudgetParams = z.infer<typeof insertBudgetParams>;
export type UpdateBudgetParams = z.infer<typeof updateBudgetParams>;
export type BudgetId = z.infer<typeof budgetIdSchema>["id"];

// this type infers the return from getBudgets() - meaning it will include any joins
export type CompleteBudget = Awaited<
  ReturnType<typeof getBudgets>
>["budgets"][number];
