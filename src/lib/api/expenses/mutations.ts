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
import { billMates } from "@/lib/db/schema/billMates";
import { billMatesToGroups } from "@/lib/db/schema/billMatesToGroups";
import { splits } from "@/lib/db/schema/splits";

export const createExpense = async (expense: NewExpenseParams) => {
  const { session } = await getUserAuth();
  const newExpense = insertExpenseSchema.parse({
    ...expense,
    userId: session?.user.id!,
  });
  try {
    const e = await db.transaction(async (tx) => {
      //get bill mates from the group
      const billMatesIds = await tx
        .select({ id: billMatesToGroups.billMateId })
        .from(billMatesToGroups)
        .where(eq(billMatesToGroups.billGroupId, newExpense.billGroupId));

      //get user bill mate record
      const [userBillMate] = await tx
        .select()
        .from(billMates)
        .where(eq(billMates.userId, session?.user.id!));

      //evenly divide the expense by number of bill mates, assuming only user paid
      const groupSize = billMatesIds.length;
      const equalPortions = Math.floor(newExpense.amount / groupSize);
      const remainder = newExpense.amount % groupSize;

      if (remainder > 0)
        console.log(`someone got an extra ${remainder} added to their tab`);

      //create expense
      const [createdExpense] = await tx
        .insert(expenses)
        .values(newExpense)
        .returning();

      //create splits
      const expenseSplits = billMatesIds.map((billMate, index) => {
        let responsible = equalPortions;
        let paid = 0;
        if (billMate.id == userBillMate.id) {
          responsible += remainder;
          paid = newExpense.amount;
        }
        return {
          expenseId: createdExpense.id,
          billMateId: billMate.id,
          paid: paid,
          responsible: responsible,
        };
      });

      await tx.insert(splits).values(expenseSplits);

      return createdExpense;
    });

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
