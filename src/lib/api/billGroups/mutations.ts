import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  BillGroupId, 
  NewBillGroupParams,
  UpdateBillGroupParams, 
  updateBillGroupSchema,
  insertBillGroupSchema, 
  billGroups,
  billGroupIdSchema 
} from "@/lib/db/schema/billGroups";

export const createBillGroup = async (billGroup: NewBillGroupParams) => {
  const newBillGroup = insertBillGroupSchema.parse(billGroup);
  try {
    const [b] =  await db.insert(billGroups).values(newBillGroup).returning();
    return { billGroup: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateBillGroup = async (id: BillGroupId, billGroup: UpdateBillGroupParams) => {
  const { id: billGroupId } = billGroupIdSchema.parse({ id });
  const newBillGroup = updateBillGroupSchema.parse(billGroup);
  try {
    const [b] =  await db
     .update(billGroups)
     .set({...newBillGroup, updatedAt: new Date().toISOString().slice(0, 19).replace("T", " ") })
     .where(eq(billGroups.id, billGroupId!))
     .returning();
    return { billGroup: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteBillGroup = async (id: BillGroupId) => {
  const { id: billGroupId } = billGroupIdSchema.parse({ id });
  try {
    const [b] =  await db.delete(billGroups).where(eq(billGroups.id, billGroupId!))
    .returning();
    return { billGroup: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

