"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/admin/bill-mates/useOptimisticBillMates";
import { type BillMate } from "@/lib/db/schema/billMates";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import BillMateForm from "@/components/billMates/BillMateForm";

export default function OptimisticBillMate({
  billMate,
}: {
  billMate: BillMate;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: BillMate) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticBillMate, setOptimisticBillMate] = useOptimistic(billMate);
  const updateBillMate: TAddOptimistic = (input) =>
    setOptimisticBillMate({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <BillMateForm
          billMate={optimisticBillMate}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateBillMate}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticBillMate.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticBillMate.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticBillMate, null, 2)}
      </pre>
    </div>
  );
}
