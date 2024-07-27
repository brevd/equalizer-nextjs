import { sql } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getBillMates } from "@/lib/api/billMates/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const billMates = sqliteTable('bill_mates', {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

});


// Schema for billMates - used to validate API requests
const baseSchema = createSelectSchema(billMates).omit(timestamps)

export const insertBillMateSchema = createInsertSchema(billMates).omit(timestamps);
export const insertBillMateParams = baseSchema.extend({}).omit({ 
  id: true,
  userId: true
});

export const updateBillMateSchema = baseSchema;
export const updateBillMateParams = baseSchema.extend({}).omit({ 
  userId: true
});
export const billMateIdSchema = baseSchema.pick({ id: true });

// Types for billMates - used to type API request params and within Components
export type BillMate = typeof billMates.$inferSelect;
export type NewBillMate = z.infer<typeof insertBillMateSchema>;
export type NewBillMateParams = z.infer<typeof insertBillMateParams>;
export type UpdateBillMateParams = z.infer<typeof updateBillMateParams>;
export type BillMateId = z.infer<typeof billMateIdSchema>["id"];
    
// this type infers the return from getBillMates() - meaning it will include any joins
export type CompleteBillMate = Awaited<ReturnType<typeof getBillMates>>["billMates"][number];

