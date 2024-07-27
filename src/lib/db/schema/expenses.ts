import { sql } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { billGroups } from "./billGroups";
import { type getExpenses } from "@/lib/api/expenses/queries";

import { nanoid, timestamps } from "@/lib/utils";
import { categories } from "./categories";

export const expenses = sqliteTable("expenses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  amount: integer("amount").notNull(),
  title: text("title").notNull(),
  paymentMethod: text("payment_method"),
  vendor: text("vendor"),
  billGroupId: text("bill_group_id")
    .references(() => billGroups.id, { onDelete: "cascade" })
    .notNull(),
  categoryId: text("category_id").references(() => categories.id),
  userId: text("user_id").notNull(),

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Schema for expenses - used to validate API requests
const baseSchema = createSelectSchema(expenses).omit(timestamps);

export const insertExpenseSchema =
  createInsertSchema(expenses).omit(timestamps);
export const insertExpenseParams = baseSchema
  .extend({
    amount: z.coerce.number(),
    billGroupId: z.coerce.string().min(1),
    categoryId: z.coerce.string().min(1).nullable().default(null),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateExpenseSchema = baseSchema;
export const updateExpenseParams = baseSchema
  .extend({
    amount: z.coerce.number(),
    billGroupId: z.coerce.string().min(1),
    categoryId: z.coerce.string().min(1).nullable().default(null),
  })
  .omit({
    userId: true,
  });
export const expenseIdSchema = baseSchema.pick({ id: true });

// Types for expenses - used to type API request params and within Components
export type Expense = typeof expenses.$inferSelect;
export type NewExpense = z.infer<typeof insertExpenseSchema>;
export type NewExpenseParams = z.infer<typeof insertExpenseParams>;
export type UpdateExpenseParams = z.infer<typeof updateExpenseParams>;
export type ExpenseId = z.infer<typeof expenseIdSchema>["id"];

// this type infers the return from getExpenses() - meaning it will include any joins
export type CompleteExpense = Awaited<
  ReturnType<typeof getExpenses>
>["expenses"][number];
