import { Suspense } from "react";

import Loading from "@/app/loading";
import SplitList from "@/components/splits/SplitList";
import { getSplits } from "@/lib/api/splits/queries";
import { getBillMates } from "@/lib/api/billMates/queries";
import { getExpenses } from "@/lib/api/expenses/queries";

export const revalidate = 0;

export default async function SplitsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Splits</h1>
        </div>
        <Splits />
      </div>
    </main>
  );
}

const Splits = async () => {
  
  const { splits } = await getSplits();
  const { billMates } = await getBillMates();
  const { expenses } = await getExpenses();
  return (
    <Suspense fallback={<Loading />}>
      <SplitList splits={splits} billMates={billMates} expenses={expenses} />
    </Suspense>
  );
};
