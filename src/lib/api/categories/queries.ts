import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type CategoryId, categoryIdSchema, categories } from "@/lib/db/schema/categories";

export const getCategories = async () => {
  const rows = await db.select().from(categories);
  const c = rows
  return { categories: c };
};

export const getCategoryById = async (id: CategoryId) => {
  const { id: categoryId } = categoryIdSchema.parse({ id });
  const [row] = await db.select().from(categories).where(eq(categories.id, categoryId));
  if (row === undefined) return {};
  const c = row;
  return { category: c };
};


