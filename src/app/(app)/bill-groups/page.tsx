import { Suspense } from "react";

import Loading from "@/app/loading";
import BillGroupList from "@/components/billGroups/BillGroupList";
import { getBillGroups } from "@/lib/api/billGroups/queries";


export const revalidate = 0;

export default async function BillGroupsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Bill Groups</h1>
        </div>
        <BillGroups />
      </div>
    </main>
  );
}

const BillGroups = async () => {
  
  const { billGroups } = await getBillGroups();
  
  return (
    <Suspense fallback={<Loading />}>
      <BillGroupList billGroups={billGroups}  />
    </Suspense>
  );
};
