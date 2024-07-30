import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import {
  type BillMatesToGroupId,
  billMatesToGroupIdSchema,
  billMatesToGroups,
} from "@/lib/db/schema/billMatesToGroups";
import { billGroups } from "@/lib/db/schema/billGroups";
import { billMates } from "@/lib/db/schema/billMates";

export const getBillMatesToGroups = async () => {
  const rows = await db
    .select({
      billMatesToGroup: billMatesToGroups,
      billGroup: billGroups,
      billMate: billMates,
    })
    .from(billMatesToGroups)
    .leftJoin(billGroups, eq(billMatesToGroups.billGroupId, billGroups.id))
    .leftJoin(billMates, eq(billMatesToGroups.billMateId, billMates.id));
  const b = rows.map((r) => ({
    ...r.billMatesToGroup,
    billGroup: r.billGroup,
    billMate: r.billMate,
  }));
  return { billMatesToGroups: b };
};

export const getBillMatesToGroupById = async (id: BillMatesToGroupId) => {
  const { id: billMatesToGroupId } = billMatesToGroupIdSchema.parse({ id });
  const [row] = await db
    .select({
      billMatesToGroup: billMatesToGroups,
      billGroup: billGroups,
      billMate: billMates,
    })
    .from(billMatesToGroups)
    .where(eq(billMatesToGroups.id, billMatesToGroupId))
    .leftJoin(billGroups, eq(billMatesToGroups.billGroupId, billGroups.id))
    .leftJoin(billMates, eq(billMatesToGroups.billMateId, billMates.id));
  if (row === undefined) return {};
  const b = {
    ...row.billMatesToGroup,
    billGroup: row.billGroup,
    billMate: row.billMate,
  };
  return { billMatesToGroup: b };
};
