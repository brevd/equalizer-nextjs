import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type BudgetId, budgetIdSchema, budgets } from "@/lib/db/schema/budgets";
import { categories } from "@/lib/db/schema/categories";

export const getBudgets = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select({ budget: budgets, category: categories }).from(budgets).leftJoin(categories, eq(budgets.categoryId, categories.id)).where(eq(budgets.userId, session?.user.id!));
  const b = rows .map((r) => ({ ...r.budget, category: r.category})); 
  return { budgets: b };
};

export const getBudgetById = async (id: BudgetId) => {
  const { session } = await getUserAuth();
  const { id: budgetId } = budgetIdSchema.parse({ id });
  const [row] = await db.select({ budget: budgets, category: categories }).from(budgets).where(and(eq(budgets.id, budgetId), eq(budgets.userId, session?.user.id!))).leftJoin(categories, eq(budgets.categoryId, categories.id));
  if (row === undefined) return {};
  const b =  { ...row.budget, category: row.category } ;
  return { budget: b };
};


