import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import {
  type BillGroupId,
  billGroupIdSchema,
  billGroups,
} from "@/lib/db/schema/billGroups";
import { expenses, type CompleteExpense } from "@/lib/db/schema/expenses";
import { getUserAuth } from "@/lib/auth/utils";
import { billMatesToGroups } from "@/lib/db/schema/billMatesToGroups";
import { billMates } from "@/lib/db/schema/billMates";

export const getBillGroups = async () => {
  const rows = await db.select().from(billGroups);
  const b = rows;
  return { billGroups: b };
};

export const getBillGroupById = async (id: BillGroupId) => {
  const { id: billGroupId } = billGroupIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(billGroups)
    .where(eq(billGroups.id, billGroupId));
  if (row === undefined) return {};
  const b = row;
  return { billGroup: b };
};

export const getBillGroupByIdWithExpenses = async (id: BillGroupId) => {
  const { id: billGroupId } = billGroupIdSchema.parse({ id });
  const rows = await db
    .select({ billGroup: billGroups, expense: expenses })
    .from(billGroups)
    .where(eq(billGroups.id, billGroupId))
    .leftJoin(expenses, eq(billGroups.id, expenses.billGroupId));
  if (rows.length === 0) return {};
  const b = rows[0].billGroup;
  const be = rows
    .filter((r) => r.expense !== null)
    .map((e) => e.expense) as CompleteExpense[];

  return { billGroup: b, expenses: be };
};

export const getBillGroupsByUserId = async () => {
  const { session } = await getUserAuth();
  if (!session?.user.id) return {};
  const rows = await db
    .select({ billGroup: billGroups })
    .from(billGroups)
    .leftJoin(
      billMatesToGroups,
      eq(billGroups.id, billMatesToGroups.billGroupId)
    )
    .leftJoin(billMates, eq(billMates.id, billMatesToGroups.billMateId))
    .where(eq(billMates.userId, session.user.id));

  return { billGroups: rows };
};
