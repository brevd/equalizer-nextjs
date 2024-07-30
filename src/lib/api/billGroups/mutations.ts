import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import {
  BillGroupId,
  NewBillGroupParams,
  UpdateBillGroupParams,
  updateBillGroupSchema,
  insertBillGroupSchema,
  billGroups,
  billGroupIdSchema,
} from "@/lib/db/schema/billGroups";
import { getUserAuth } from "@/lib/auth/utils";
import { billMates } from "@/lib/db/schema/billMates";
import {
  billMatesToGroups,
  insertBillMatesToGroupSchema,
} from "@/lib/db/schema/billMatesToGroups";

export const createBillGroup = async (billGroup: NewBillGroupParams) => {
  const newBillGroup = insertBillGroupSchema.parse(billGroup);
  const { session } = await getUserAuth();

  if (!session) throw { error: "cannot find session" };
  try {
    const b = await db.transaction(async (tx) => {
      const [b] = await tx.insert(billGroups).values(newBillGroup).returning();
      const [currentBillMate] = await tx
        .select({ billMate: billMates })
        .from(billMates)
        .where(eq(billMates.userId, session.user.id))
        .limit(1);
      if (!currentBillMate.billMate.id) throw new Error();
      const newBillMatesToGroup = insertBillMatesToGroupSchema.parse({
        billGroupId: b.id,
        billMateId: currentBillMate.billMate.id,
      });
      await tx.insert(billMatesToGroups).values(newBillMatesToGroup);
      return b;
    });

    return { billGroup: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateBillGroup = async (
  id: BillGroupId,
  billGroup: UpdateBillGroupParams
) => {
  const { id: billGroupId } = billGroupIdSchema.parse({ id });
  const newBillGroup = updateBillGroupSchema.parse(billGroup);
  try {
    const [b] = await db
      .update(billGroups)
      .set({
        ...newBillGroup,
        updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      })
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
    const [b] = await db
      .delete(billGroups)
      .where(eq(billGroups.id, billGroupId!))
      .returning();
    return { billGroup: b };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
