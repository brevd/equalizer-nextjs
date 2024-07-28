import { Suspense } from "react";

import Loading from "@/app/loading";
import ExpenseList from "@/components/expenses/ExpenseList";
import { getExpenses } from "@/lib/api/expenses/queries";
import { getBillGroups } from "@/lib/api/billGroups/queries";
import { checkAuth } from "@/lib/auth/utils";
import { getCategories } from "@/lib/api/categories/queries";

export const revalidate = 0;

export default async function ExpensesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Expenses</h1>
        </div>
        <Expenses />
      </div>
    </main>
  );
}

const Expenses = async () => {
  await checkAuth();

  const { expenses } = await getExpenses();
  const { billGroups } = await getBillGroups();
  const { categories } = await getCategories();
  return (
    <Suspense fallback={<Loading />}>
      <ExpenseList
        expenses={expenses}
        billGroups={billGroups}
        categories={categories}
      />
    </Suspense>
  );
};
