import { getBillGroupsByUserId } from "@/lib/api/billGroups/queries";
import GroupList from "./group";

export default async function Groups() {
  const { billGroups } = await getBillGroupsByUserId();
  return (
    <>
      <div className="relative">
        {/* list of gropups you are a bill mate in */}
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">My Groups</h1>
        </div>
        <GroupList billGroups={billGroups} />
      </div>
    </>
  );
}
