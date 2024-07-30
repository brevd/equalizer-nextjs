"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/admin/bill-groups/useOptimisticBillGroups";
import { type BillGroup } from "@/lib/db/schema/billGroups";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import BillGroupForm from "@/components/billGroups/BillGroupForm";
import { BillMate } from "@/lib/db/schema/billMates";

export default function OptimisticBillGroup({
  billGroup,
  billMates,
}: {
  billGroup: BillGroup;
  billMates: BillMate[];
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: BillGroup) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticBillGroup, setOptimisticBillGroup] =
    useOptimistic(billGroup);
  const updateBillGroup: TAddOptimistic = (input) =>
    setOptimisticBillGroup({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <BillGroupForm
          billGroup={optimisticBillGroup}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateBillGroup}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticBillGroup.title}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticBillGroup.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticBillGroup, null, 2)}
      </pre>
      <h3 className="font-semibold text-lg mt-2">Members</h3>
      {billMates.map((b) => (
        <p key={b.id}>{b.name}</p>
      ))}
    </div>
  );
}
