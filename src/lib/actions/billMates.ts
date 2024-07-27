"use server";

import { revalidatePath } from "next/cache";
import {
  createBillMate,
  deleteBillMate,
  updateBillMate,
} from "@/lib/api/billMates/mutations";
import {
  BillMateId,
  NewBillMateParams,
  UpdateBillMateParams,
  billMateIdSchema,
  insertBillMateParams,
  updateBillMateParams,
} from "@/lib/db/schema/billMates";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateBillMates = () => revalidatePath("/bill-mates");

export const createBillMateAction = async (input: NewBillMateParams) => {
  try {
    const payload = insertBillMateParams.parse(input);
    await createBillMate(payload);
    revalidateBillMates();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateBillMateAction = async (input: UpdateBillMateParams) => {
  try {
    const payload = updateBillMateParams.parse(input);
    await updateBillMate(payload.id, payload);
    revalidateBillMates();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteBillMateAction = async (input: BillMateId) => {
  try {
    const payload = billMateIdSchema.parse({ id: input });
    await deleteBillMate(payload.id);
    revalidateBillMates();
  } catch (e) {
    return handleErrors(e);
  }
};