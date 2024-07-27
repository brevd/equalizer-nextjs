"use server";

import { revalidatePath } from "next/cache";
import {
  createBillGroup,
  deleteBillGroup,
  updateBillGroup,
} from "@/lib/api/billGroups/mutations";
import {
  BillGroupId,
  NewBillGroupParams,
  UpdateBillGroupParams,
  billGroupIdSchema,
  insertBillGroupParams,
  updateBillGroupParams,
} from "@/lib/db/schema/billGroups";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateBillGroups = () => revalidatePath("/bill-groups");

export const createBillGroupAction = async (input: NewBillGroupParams) => {
  try {
    const payload = insertBillGroupParams.parse(input);
    await createBillGroup(payload);
    revalidateBillGroups();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateBillGroupAction = async (input: UpdateBillGroupParams) => {
  try {
    const payload = updateBillGroupParams.parse(input);
    await updateBillGroup(payload.id, payload);
    revalidateBillGroups();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteBillGroupAction = async (input: BillGroupId) => {
  try {
    const payload = billGroupIdSchema.parse({ id: input });
    await deleteBillGroup(payload.id);
    revalidateBillGroups();
  } catch (e) {
    return handleErrors(e);
  }
};