import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getSplitById } from "@/lib/api/splits/queries";
import { getBillMates } from "@/lib/api/billMates/queries";
import { getExpenses } from "@/lib/api/expenses/queries";import OptimisticSplit from "@/app/(app)/splits/[splitId]/OptimisticSplit";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function SplitPage({
  params,
}: {
  params: { splitId: string };
}) {

  return (
    <main className="overflow-auto">
      <Split id={params.splitId} />
    </main>
  );
}

const Split = async ({ id }: { id: string }) => {
  
  const { split } = await getSplitById(id);
  const { billMates } = await getBillMates();
  const { expenses } = await getExpenses();

  if (!split) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="splits" />
        <OptimisticSplit split={split} billMates={billMates}
        billMateId={split.billMateId} expenses={expenses}
        expenseId={split.expenseId} />
      </div>
    </Suspense>
  );
};
