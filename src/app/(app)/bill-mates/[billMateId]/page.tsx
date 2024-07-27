import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getBillMateById } from "@/lib/api/billMates/queries";
import OptimisticBillMate from "./OptimisticBillMate";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function BillMatePage({
  params,
}: {
  params: { billMateId: string };
}) {

  return (
    <main className="overflow-auto">
      <BillMate id={params.billMateId} />
    </main>
  );
}

const BillMate = async ({ id }: { id: string }) => {
  await checkAuth();

  const { billMate } = await getBillMateById(id);
  

  if (!billMate) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="bill-mates" />
        <OptimisticBillMate billMate={billMate}  />
      </div>
    </Suspense>
  );
};
