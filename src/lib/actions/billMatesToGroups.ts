"use server";

import { revalidatePath } from "next/cache";
import {
  createBillMatesToGroup,
  deleteBillMatesToGroup,
  updateBillMatesToGroup,
} from "@/lib/api/billMatesToGroups/mutations";
import {
  BillMatesToGroupId,
  NewBillMatesToGroupParams,
  UpdateBillMatesToGroupParams,
  billMatesToGroupIdSchema,
  insertBillMatesToGroupParams,
  updateBillMatesToGroupParams,
} from "@/lib/db/schema/billMatesToGroups";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateBillMatesToGroups = () => revalidatePath("/bill-mates-to-groups");

export const createBillMatesToGroupAction = async (input: NewBillMatesToGroupParams) => {
  try {
    const payload = insertBillMatesToGroupParams.parse(input);
    await createBillMatesToGroup(payload);
    revalidateBillMatesToGroups();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateBillMatesToGroupAction = async (input: UpdateBillMatesToGroupParams) => {
  try {
    const payload = updateBillMatesToGroupParams.parse(input);
    await updateBillMatesToGroup(payload.id, payload);
    revalidateBillMatesToGroups();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteBillMatesToGroupAction = async (input: BillMatesToGroupId) => {
  try {
    const payload = billMatesToGroupIdSchema.parse({ id: input });
    await deleteBillMatesToGroup(payload.id);
    revalidateBillMatesToGroups();
  } catch (e) {
    return handleErrors(e);
  }
};