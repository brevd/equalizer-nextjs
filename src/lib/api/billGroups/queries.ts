import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type BillGroupId, billGroupIdSchema, billGroups } from "@/lib/db/schema/billGroups";
import { expenses, type CompleteExpense } from "@/lib/db/schema/expenses";

export const getBillGroups = async () => {
  const rows = await db.select().from(billGroups);
  const b = rows
  return { billGroups: b };
};

export const getBillGroupById = async (id: BillGroupId) => {
  const { id: billGroupId } = billGroupIdSchema.parse({ id });
  const [row] = await db.select().from(billGroups).where(eq(billGroups.id, billGroupId));
  if (row === undefined) return {};
  const b = row;
  return { billGroup: b };
};

export const getBillGroupByIdWithExpenses = async (id: BillGroupId) => {
  const { id: billGroupId } = billGroupIdSchema.parse({ id });
  const rows = await db.select({ billGroup: billGroups, expense: expenses }).from(billGroups).where(eq(billGroups.id, billGroupId)).leftJoin(expenses, eq(billGroups.id, expenses.billGroupId));
  if (rows.length === 0) return {};
  const b = rows[0].billGroup;
  const be = rows.filter((r) => r.expense !== null).map((e) => e.expense) as CompleteExpense[];

  return { billGroup: b, expenses: be };
};

