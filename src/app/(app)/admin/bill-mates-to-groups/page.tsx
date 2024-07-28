import { Suspense } from "react";

import Loading from "@/app/loading";
import BillMatesToGroupList from "@/components/billMatesToGroups/BillMatesToGroupList";
import { getBillMatesToGroups } from "@/lib/api/billMatesToGroups/queries";
import { getBillGroups } from "@/lib/api/billGroups/queries";
import { getBillMates } from "@/lib/api/billMates/queries";

export const revalidate = 0;

export default async function BillMatesToGroupsPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Bill Mates To Groups</h1>
        </div>
        <BillMatesToGroups />
      </div>
    </main>
  );
}

const BillMatesToGroups = async () => {
  
  const { billMatesToGroups } = await getBillMatesToGroups();
  const { billGroups } = await getBillGroups();
  const { billMates } = await getBillMates();
  return (
    <Suspense fallback={<Loading />}>
      <BillMatesToGroupList billMatesToGroups={billMatesToGroups} billGroups={billGroups} billMates={billMates} />
    </Suspense>
  );
};
