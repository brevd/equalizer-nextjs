import { Suspense } from "react";

import Loading from "@/app/loading";
import BillMateList from "@/components/billMates/BillMateList";
import { getBillMates } from "@/lib/api/billMates/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function BillMatesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Bill Mates</h1>
        </div>
        <BillMates />
      </div>
    </main>
  );
}

const BillMates = async () => {
  await checkAuth();

  const { billMates } = await getBillMates();
  
  return (
    <Suspense fallback={<Loading />}>
      <BillMateList billMates={billMates}  />
    </Suspense>
  );
};
