import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  BillMateId, 
  NewBillMateParams,
  UpdateBillMateParams, 
  updateBillMateSchema,
  insertBillMateSchema, 
  billMates,
  billMateIdSchema 
} from "@/lib/db/schema/billMates";
import { getUserAuth } from "@/lib/auth/utils";

export const createBillMate = async (billMate: NewBillMateParams) => {
  const { session } = await getUserAuth();
  const newBillMate = insertBillMateSchema.parse({ ...billMate, userId: session?.user.id! });
  try {
    const [b] =  await db.insert(billMates).values(newBillMate).returning();
    return { billMate: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateBillMate = async (id: BillMateId, billMate: UpdateBillMateParams) => {
  const { session } = await getUserAuth();
  const { id: billMateId } = billMateIdSchema.parse({ id });
  const newBillMate = updateBillMateSchema.parse({ ...billMate, userId: session?.user.id! });
  try {
    const [b] =  await db
     .update(billMates)
     .set({...newBillMate, updatedAt: new Date().toISOString().slice(0, 19).replace("T", " ") })
     .where(and(eq(billMates.id, billMateId!), eq(billMates.userId, session?.user.id!)))
     .returning();
    return { billMate: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteBillMate = async (id: BillMateId) => {
  const { session } = await getUserAuth();
  const { id: billMateId } = billMateIdSchema.parse({ id });
  try {
    const [b] =  await db.delete(billMates).where(and(eq(billMates.id, billMateId!), eq(billMates.userId, session?.user.id!)))
    .returning();
    return { billMate: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

