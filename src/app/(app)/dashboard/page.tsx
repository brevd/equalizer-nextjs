import { Button } from "@/components/ui/button";
import { getBillGroupsByUserId } from "@/lib/api/billGroups/queries";
import { getUserAuth } from "@/lib/auth/utils";
import Link from "next/link";
import { BudgetChart } from "./budgetsChart";
import { BalancesChart } from "./balancesChart";
import RecentExpensesByGroup from "./transactions";

export default async function Home() {
  const userAuth = await getUserAuth();
  const x = await getBillGroupsByUserId();
  return (
    <main className="space-y-6">
      <h1 className="font-semibold text-2xl">Welcome Back!</h1>
      <div className="flex gap-2 min-h-96">
        <div className="w-1/3">
          <BudgetChart />
        </div>
        <div className="w-2/3">
          <BalancesChart />
        </div>
      </div>
      <RecentExpensesByGroup />
    </main>
  );
}
