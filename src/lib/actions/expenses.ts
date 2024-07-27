"use server";

import { revalidatePath } from "next/cache";
import {
  createExpense,
  deleteExpense,
  updateExpense,
} from "@/lib/api/expenses/mutations";
import {
  ExpenseId,
  NewExpenseParams,
  UpdateExpenseParams,
  expenseIdSchema,
  insertExpenseParams,
  updateExpenseParams,
} from "@/lib/db/schema/expenses";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateExpenses = () => revalidatePath("/expenses");

export const createExpenseAction = async (input: NewExpenseParams) => {
  try {
    const payload = insertExpenseParams.parse(input);
    await createExpense(payload);
    revalidateExpenses();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateExpenseAction = async (input: UpdateExpenseParams) => {
  try {
    const payload = updateExpenseParams.parse(input);
    await updateExpense(payload.id, payload);
    revalidateExpenses();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteExpenseAction = async (input: ExpenseId) => {
  try {
    const payload = expenseIdSchema.parse({ id: input });
    await deleteExpense(payload.id);
    revalidateExpenses();
  } catch (e) {
    return handleErrors(e);
  }
};