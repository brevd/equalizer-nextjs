import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getExpenseByIdWithSplits } from "@/lib/api/expenses/queries";
import { getBillGroups } from "@/lib/api/billGroups/queries";
import OptimisticExpense from "@/app/(app)/admin/expenses/[expenseId]/OptimisticExpense";
import { checkAuth } from "@/lib/auth/utils";
import SplitList from "@/components/splits/SplitList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";
import { getBillMates } from "@/lib/api/billMates/queries";
import { getCategories } from "@/lib/api/categories/queries";

export const revalidate = 0;

export default async function ExpensePage({
  params,
}: {
  params: { expenseId: string };
}) {
  return (
    <main className="overflow-auto">
      <Expense id={params.expenseId} />
    </main>
  );
}

const Expense = async ({ id }: { id: string }) => {
  await checkAuth();

  const { expense, splits } = await getExpenseByIdWithSplits(id);
  const { billGroups } = await getBillGroups();
  const { billMates } = await getBillMates();
  const { categories } = await getCategories();

  if (!expense) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="expenses" />
        <OptimisticExpense
          expense={expense}
          billGroups={billGroups}
          billGroupId={expense.billGroupId}
          categories={categories}
          categoryId={expense.categoryId || undefined}
        />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">
          {expense.amount}&apos;s Splits
        </h3>
        <SplitList
          expenses={[]}
          expenseId={expense.id}
          splits={splits}
          billMates={billMates}
        />
      </div>
    </Suspense>
  );
};