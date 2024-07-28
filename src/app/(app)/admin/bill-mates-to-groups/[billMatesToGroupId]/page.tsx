import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getBillMatesToGroupById } from "@/lib/api/billMatesToGroups/queries";
import { getBillGroups } from "@/lib/api/billGroups/queries";
import { getBillMates } from "@/lib/api/billMates/queries";import OptimisticBillMatesToGroup from "./OptimisticBillMatesToGroup";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function BillMatesToGroupPage({
  params,
}: {
  params: { billMatesToGroupId: string };
}) {

  return (
    <main className="overflow-auto">
      <BillMatesToGroup id={params.billMatesToGroupId} />
    </main>
  );
}

const BillMatesToGroup = async ({ id }: { id: string }) => {
  
  const { billMatesToGroup } = await getBillMatesToGroupById(id);
  const { billGroups } = await getBillGroups();
  const { billMates } = await getBillMates();

  if (!billMatesToGroup) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="bill-mates-to-groups" />
        <OptimisticBillMatesToGroup billMatesToGroup={billMatesToGroup} billGroups={billGroups} billMates={billMates} />
      </div>
    </Suspense>
  );
};
