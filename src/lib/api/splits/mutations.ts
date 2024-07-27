import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  SplitId, 
  NewSplitParams,
  UpdateSplitParams, 
  updateSplitSchema,
  insertSplitSchema, 
  splits,
  splitIdSchema 
} from "@/lib/db/schema/splits";

export const createSplit = async (split: NewSplitParams) => {
  const newSplit = insertSplitSchema.parse(split);
  try {
    const [s] =  await db.insert(splits).values(newSplit).returning();
    return { split: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateSplit = async (id: SplitId, split: UpdateSplitParams) => {
  const { id: splitId } = splitIdSchema.parse({ id });
  const newSplit = updateSplitSchema.parse(split);
  try {
    const [s] =  await db
     .update(splits)
     .set({...newSplit, updatedAt: new Date().toISOString().slice(0, 19).replace("T", " ") })
     .where(eq(splits.id, splitId!))
     .returning();
    return { split: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteSplit = async (id: SplitId) => {
  const { id: splitId } = splitIdSchema.parse({ id });
  try {
    const [s] =  await db.delete(splits).where(eq(splits.id, splitId!))
    .returning();
    return { split: s };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

