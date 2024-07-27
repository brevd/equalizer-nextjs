import { sql } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getBillGroups } from "@/lib/api/billGroups/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const billGroups = sqliteTable('bill_groups', {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  description: text("description"),
  
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

});


// Schema for billGroups - used to validate API requests
const baseSchema = createSelectSchema(billGroups).omit(timestamps)

export const insertBillGroupSchema = createInsertSchema(billGroups).omit(timestamps);
export const insertBillGroupParams = baseSchema.extend({}).omit({ 
  id: true
});

export const updateBillGroupSchema = baseSchema;
export const updateBillGroupParams = baseSchema.extend({})
export const billGroupIdSchema = baseSchema.pick({ id: true });

// Types for billGroups - used to type API request params and within Components
export type BillGroup = typeof billGroups.$inferSelect;
export type NewBillGroup = z.infer<typeof insertBillGroupSchema>;
export type NewBillGroupParams = z.infer<typeof insertBillGroupParams>;
export type UpdateBillGroupParams = z.infer<typeof updateBillGroupParams>;
export type BillGroupId = z.infer<typeof billGroupIdSchema>["id"];
    
// this type infers the return from getBillGroups() - meaning it will include any joins
export type CompleteBillGroup = Awaited<ReturnType<typeof getBillGroups>>["billGroups"][number];

