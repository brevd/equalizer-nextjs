import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  BillMatesToGroupId, 
  NewBillMatesToGroupParams,
  UpdateBillMatesToGroupParams, 
  updateBillMatesToGroupSchema,
  insertBillMatesToGroupSchema, 
  billMatesToGroups,
  billMatesToGroupIdSchema 
} from "@/lib/db/schema/billMatesToGroups";

export const createBillMatesToGroup = async (billMatesToGroup: NewBillMatesToGroupParams) => {
  const newBillMatesToGroup = insertBillMatesToGroupSchema.parse(billMatesToGroup);
  try {
    const [b] =  await db.insert(billMatesToGroups).values(newBillMatesToGroup).returning();
    return { billMatesToGroup: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateBillMatesToGroup = async (id: BillMatesToGroupId, billMatesToGroup: UpdateBillMatesToGroupParams) => {
  const { id: billMatesToGroupId } = billMatesToGroupIdSchema.parse({ id });
  const newBillMatesToGroup = updateBillMatesToGroupSchema.parse(billMatesToGroup);
  try {
    const [b] =  await db
     .update(billMatesToGroups)
     .set({...newBillMatesToGroup, updatedAt: new Date().toISOString().slice(0, 19).replace("T", " ") })
     .where(eq(billMatesToGroups.id, billMatesToGroupId!))
     .returning();
    return { billMatesToGroup: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteBillMatesToGroup = async (id: BillMatesToGroupId) => {
  const { id: billMatesToGroupId } = billMatesToGroupIdSchema.parse({ id });
  try {
    const [b] =  await db.delete(billMatesToGroups).where(eq(billMatesToGroups.id, billMatesToGroupId!))
    .returning();
    return { billMatesToGroup: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

