import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type BillMateId,
  billMateIdSchema,
  billMates,
} from "@/lib/db/schema/billMates";
import { BillGroupId, billGroupIdSchema } from "@/lib/db/schema/billGroups";
import { billMatesToGroups } from "@/lib/db/schema/billMatesToGroups";

export const getBillMates = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select().from(billMates);
  // .where(eq(billMates.userId, session?.user.id!));
  const b = rows;
  return { billMates: b };
};

export const getBillMateById = async (id: BillMateId) => {
  const { session } = await getUserAuth();
  const { id: billMateId } = billMateIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(billMates)
    .where(
      and(eq(billMates.id, billMateId), eq(billMates.userId, session?.user.id!))
    );
  if (row === undefined) return {};
  const b = row;
  return { billMate: b };
};

export const getBillMateByUserId = async () => {
  const { session } = await getUserAuth();
  const [row] = await db
    .select()
    .from(billMates)
    .where(eq(billMates.userId, session?.user.id!));
  if (row === undefined) return {};
  const b = row;
  return { billMate: b };
};

export const getBillMatesByGroupId = async (id: BillGroupId) => {
  const { id: billGroupId } = billGroupIdSchema.parse({ id });
  const rows = await db
    .select({
      id: billMates.id,
      name: billMates.name,
      userId: billMates.userId,
      createdAt: billMates.createdAt,
      updatedAt: billMates.updatedAt,
    })
    .from(billMates)
    .leftJoin(billMatesToGroups, eq(billMates.id, billMatesToGroups.billMateId))
    .where(eq(billMatesToGroups.billGroupId, billGroupId));
  const b = rows;
  return { billMates: b };
};
