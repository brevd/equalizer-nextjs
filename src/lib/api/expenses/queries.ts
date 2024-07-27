import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type ExpenseId, expenseIdSchema, expenses } from "@/lib/db/schema/expenses";
import { billGroups } from "@/lib/db/schema/billGroups";
import { splits, type CompleteSplit } from "@/lib/db/schema/splits";

export const getExpenses = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ expense: expenses, billGroup: billGroups }).from(expenses).leftJoin(billGroups, eq(expenses.billGroupId, billGroups.id)).where(eq(expenses.userId, session?.user.id!));
  const e = rows .map((r) => ({ ...r.expense, billGroup: r.billGroup})); 
  return { expenses: e };
};

export const getExpenseById = async (id: ExpenseId) => {
  const { session } = await getUserAuth();
  const { id: expenseId } = expenseIdSchema.parse({ id });
  const [row] = await db.select({ expense: expenses, billGroup: billGroups }).from(expenses).where(and(eq(expenses.id, expenseId), eq(expenses.userId, session?.user.id!))).leftJoin(billGroups, eq(expenses.billGroupId, billGroups.id));
  if (row === undefined) return {};
  const e =  { ...row.expense, billGroup: row.billGroup } ;
  return { expense: e };
};

export const getExpenseByIdWithSplits = async (id: ExpenseId) => {
  const { session } = await getUserAuth();
  const { id: expenseId } = expenseIdSchema.parse({ id });
  const rows = await db.select({ expense: expenses, split: splits }).from(expenses).where(and(eq(expenses.id, expenseId), eq(expenses.userId, session?.user.id!))).leftJoin(splits, eq(expenses.id, splits.expenseId));
  if (rows.length === 0) return {};
  const e = rows[0].expense;
  const es = rows.filter((r) => r.split !== null).map((s) => s.split) as CompleteSplit[];

  return { expense: e, splits: es };
};

