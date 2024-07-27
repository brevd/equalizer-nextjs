import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import {
  ExpenseId,
  NewExpenseParams,
  UpdateExpenseParams,
  updateExpenseSchema,
  insertExpenseSchema,
  expenses,
  expenseIdSchema,
} from "@/lib/db/schema/expenses";
import { getUserAuth } from "@/lib/auth/utils";

export const createExpense = async (expense: NewExpenseParams) => {
  const { session } = await getUserAuth();
  const newExpense = insertExpenseSchema.parse({
    ...expense,
    userId: session?.user.id!,
  });
  try {
    const [e] = await db.insert(expenses).values(newExpense).returning();
    return { expense: e };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateExpense = async (
  id: ExpenseId,
  expense: UpdateExpenseParams
) => {
  const { session } = await getUserAuth();
  const { id: expenseId } = expenseIdSchema.parse({ id });
  const newExpense = updateExpenseSchema.parse({
    ...expense,
    userId: session?.user.id!,
  });
  try {
    const [e] = await db
      .update(expenses)
      .set({
        ...newExpense,
        updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      })
      .where(
        and(eq(expenses.id, expenseId!), eq(expenses.userId, session?.user.id!))
      )
      .returning();
    return { expense: e };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteExpense = async (id: ExpenseId) => {
  const { session } = await getUserAuth();
  const { id: expenseId } = expenseIdSchema.parse({ id });
  try {
    const [e] = await db
      .delete(expenses)
      .where(
        and(eq(expenses.id, expenseId!), eq(expenses.userId, session?.user.id!))
      )
      .returning();
    return { expense: e };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
