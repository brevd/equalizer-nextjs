import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type BillMateId, billMateIdSchema, billMates } from "@/lib/db/schema/billMates";

export const getBillMates = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select().from(billMates).where(eq(billMates.userId, session?.user.id!));
  const b = rows
  return { billMates: b };
};

export const getBillMateById = async (id: BillMateId) => {
  const { session } = await getUserAuth();
  const { id: billMateId } = billMateIdSchema.parse({ id });
  const [row] = await db.select().from(billMates).where(and(eq(billMates.id, billMateId), eq(billMates.userId, session?.user.id!)));
  if (row === undefined) return {};
  const b = row;
  return { billMate: b };
};


