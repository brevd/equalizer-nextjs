import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getBudgetById } from "@/lib/api/budgets/queries";
import { getCategories } from "@/lib/api/categories/queries";import OptimisticBudget from "./OptimisticBudget";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function BudgetPage({
  params,
}: {
  params: { budgetId: string };
}) {

  return (
    <main className="overflow-auto">
      <Budget id={params.budgetId} />
    </main>
  );
}

const Budget = async ({ id }: { id: string }) => {
  await checkAuth();

  const { budget } = await getBudgetById(id);
  const { categories } = await getCategories();

  if (!budget) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="budgets" />
        <OptimisticBudget budget={budget} categories={categories} />
      </div>
    </Suspense>
  );
};
