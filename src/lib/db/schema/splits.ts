import { sql } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { billMates } from "./billMates"
import { expenses } from "./expenses"
import { type getSplits } from "@/lib/api/splits/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const splits = sqliteTable('splits', {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  paid: integer("paid").notNull(),
  responsible: integer("responsible").notNull(),
  billMateId: text("bill_mate_id").references(() => billMates.id).notNull(),
  expenseId: text("expense_id").references(() => expenses.id, { onDelete: "cascade" }).notNull(),
  
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

});


// Schema for splits - used to validate API requests
const baseSchema = createSelectSchema(splits).omit(timestamps)

export const insertSplitSchema = createInsertSchema(splits).omit(timestamps);
export const insertSplitParams = baseSchema.extend({
  paid: z.coerce.number(),
  responsible: z.coerce.number(),
  billMateId: z.coerce.string().min(1),
  expenseId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateSplitSchema = baseSchema;
export const updateSplitParams = baseSchema.extend({
  paid: z.coerce.number(),
  responsible: z.coerce.number(),
  billMateId: z.coerce.string().min(1),
  expenseId: z.coerce.string().min(1)
})
export const splitIdSchema = baseSchema.pick({ id: true });

// Types for splits - used to type API request params and within Components
export type Split = typeof splits.$inferSelect;
export type NewSplit = z.infer<typeof insertSplitSchema>;
export type NewSplitParams = z.infer<typeof insertSplitParams>;
export type UpdateSplitParams = z.infer<typeof updateSplitParams>;
export type SplitId = z.infer<typeof splitIdSchema>["id"];
    
// this type infers the return from getSplits() - meaning it will include any joins
export type CompleteSplit = Awaited<ReturnType<typeof getSplits>>["splits"][number];

