import { sql } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { billGroups } from "./billGroups"
import { billMates } from "./billMates"
import { type getBillMatesToGroups } from "@/lib/api/billMatesToGroups/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const billMatesToGroups = sqliteTable('bill_mates_to_groups', {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  billGroupId: text("bill_group_id").references(() => billGroups.id, { onDelete: "cascade" }).notNull(),
  billMateId: text("bill_mate_id").references(() => billMates.id, { onDelete: "cascade" }).notNull(),
  
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

});


// Schema for billMatesToGroups - used to validate API requests
const baseSchema = createSelectSchema(billMatesToGroups).omit(timestamps)

export const insertBillMatesToGroupSchema = createInsertSchema(billMatesToGroups).omit(timestamps);
export const insertBillMatesToGroupParams = baseSchema.extend({
  billGroupId: z.coerce.string().min(1),
  billMateId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateBillMatesToGroupSchema = baseSchema;
export const updateBillMatesToGroupParams = baseSchema.extend({
  billGroupId: z.coerce.string().min(1),
  billMateId: z.coerce.string().min(1)
})
export const billMatesToGroupIdSchema = baseSchema.pick({ id: true });

// Types for billMatesToGroups - used to type API request params and within Components
export type BillMatesToGroup = typeof billMatesToGroups.$inferSelect;
export type NewBillMatesToGroup = z.infer<typeof insertBillMatesToGroupSchema>;
export type NewBillMatesToGroupParams = z.infer<typeof insertBillMatesToGroupParams>;
export type UpdateBillMatesToGroupParams = z.infer<typeof updateBillMatesToGroupParams>;
export type BillMatesToGroupId = z.infer<typeof billMatesToGroupIdSchema>["id"];
    
// this type infers the return from getBillMatesToGroups() - meaning it will include any joins
export type CompleteBillMatesToGroup = Awaited<ReturnType<typeof getBillMatesToGroups>>["billMatesToGroups"][number];

