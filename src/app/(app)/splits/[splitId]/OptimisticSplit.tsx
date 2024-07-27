"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/splits/useOptimisticSplits";
import { type Split } from "@/lib/db/schema/splits";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import SplitForm from "@/components/splits/SplitForm";
import { type BillMate, type BillMateId } from "@/lib/db/schema/billMates";
import { type Expense, type ExpenseId } from "@/lib/db/schema/expenses";

export default function OptimisticSplit({ 
  split,
  billMates,
  billMateId,
  expenses,
  expenseId 
}: { 
  split: Split; 
  
  billMates: BillMate[];
  billMateId?: BillMateId
  expenses: Expense[];
  expenseId?: ExpenseId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Split) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticSplit, setOptimisticSplit] = useOptimistic(split);
  const updateSplit: TAddOptimistic = (input) =>
    setOptimisticSplit({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <SplitForm
          split={optimisticSplit}
          billMates={billMates}
        billMateId={billMateId}
        expenses={expenses}
        expenseId={expenseId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateSplit}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticSplit.paid}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticSplit.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticSplit, null, 2)}
      </pre>
    </div>
  );
}
