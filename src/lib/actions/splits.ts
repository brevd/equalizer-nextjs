"use server";

import { revalidatePath } from "next/cache";
import {
  createSplit,
  deleteSplit,
  updateSplit,
} from "@/lib/api/splits/mutations";
import {
  SplitId,
  NewSplitParams,
  UpdateSplitParams,
  splitIdSchema,
  insertSplitParams,
  updateSplitParams,
} from "@/lib/db/schema/splits";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateSplits = () => revalidatePath("/splits");

export const createSplitAction = async (input: NewSplitParams) => {
  try {
    const payload = insertSplitParams.parse(input);
    await createSplit(payload);
    revalidateSplits();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateSplitAction = async (input: UpdateSplitParams) => {
  try {
    const payload = updateSplitParams.parse(input);
    await updateSplit(payload.id, payload);
    revalidateSplits();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteSplitAction = async (input: SplitId) => {
  try {
    const payload = splitIdSchema.parse({ id: input });
    await deleteSplit(payload.id);
    revalidateSplits();
  } catch (e) {
    return handleErrors(e);
  }
};