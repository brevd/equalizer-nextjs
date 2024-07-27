import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type SplitId, splitIdSchema, splits } from "@/lib/db/schema/splits";
import { billMates } from "@/lib/db/schema/billMates";
import { expenses } from "@/lib/db/schema/expenses";

export const getSplits = async () => {
  const rows = await db.select({ split: splits, billMate: billMates, expense: expenses }).from(splits).leftJoin(billMates, eq(splits.billMateId, billMates.id)).leftJoin(expenses, eq(splits.expenseId, expenses.id));
  const s = rows .map((r) => ({ ...r.split, billMate: r.billMate, expense: r.expense})); 
  return { splits: s };
};

export const getSplitById = async (id: SplitId) => {
  const { id: splitId } = splitIdSchema.parse({ id });
  const [row] = await db.select({ split: splits, billMate: billMates, expense: expenses }).from(splits).where(eq(splits.id, splitId)).leftJoin(billMates, eq(splits.billMateId, billMates.id)).leftJoin(expenses, eq(splits.expenseId, expenses.id));
  if (row === undefined) return {};
  const s =  { ...row.split, billMate: row.billMate, expense: row.expense } ;
  return { split: s };
};


