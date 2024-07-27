import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getBillGroupByIdWithExpenses } from "@/lib/api/billGroups/queries";
import OptimisticBillGroup from "./OptimisticBillGroup";
import ExpenseList from "@/components/expenses/ExpenseList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function BillGroupPage({
  params,
}: {
  params: { billGroupId: string };
}) {

  return (
    <main className="overflow-auto">
      <BillGroup id={params.billGroupId} />
    </main>
  );
}

const BillGroup = async ({ id }: { id: string }) => {
  
  const { billGroup, expenses } = await getBillGroupByIdWithExpenses(id);
  

  if (!billGroup) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="bill-groups" />
        <OptimisticBillGroup billGroup={billGroup}  />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{billGroup.title}&apos;s Expenses</h3>
        <ExpenseList
          billGroups={[]}
          billGroupId={billGroup.id}
          expenses={expenses}
        />
      </div>
    </Suspense>
  );
};
