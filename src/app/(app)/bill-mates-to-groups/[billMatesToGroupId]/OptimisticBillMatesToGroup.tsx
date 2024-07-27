"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/bill-mates-to-groups/useOptimisticBillMatesToGroups";
import { type BillMatesToGroup } from "@/lib/db/schema/billMatesToGroups";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import BillMatesToGroupForm from "@/components/billMatesToGroups/BillMatesToGroupForm";
import { type BillGroup, type BillGroupId } from "@/lib/db/schema/billGroups";
import { type BillMate, type BillMateId } from "@/lib/db/schema/billMates";

export default function OptimisticBillMatesToGroup({ 
  billMatesToGroup,
  billGroups,
  billGroupId,
  billMates,
  billMateId 
}: { 
  billMatesToGroup: BillMatesToGroup; 
  
  billGroups: BillGroup[];
  billGroupId?: BillGroupId
  billMates: BillMate[];
  billMateId?: BillMateId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: BillMatesToGroup) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticBillMatesToGroup, setOptimisticBillMatesToGroup] = useOptimistic(billMatesToGroup);
  const updateBillMatesToGroup: TAddOptimistic = (input) =>
    setOptimisticBillMatesToGroup({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <BillMatesToGroupForm
          billMatesToGroup={optimisticBillMatesToGroup}
          billGroups={billGroups}
        billGroupId={billGroupId}
        billMates={billMates}
        billMateId={billMateId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateBillMatesToGroup}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticBillMatesToGroup.billGroupId}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticBillMatesToGroup.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticBillMatesToGroup, null, 2)}
      </pre>
    </div>
  );
}
