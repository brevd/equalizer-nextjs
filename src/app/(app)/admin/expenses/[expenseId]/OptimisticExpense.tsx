"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/admin/expenses/useOptimisticExpenses";
import { type Expense } from "@/lib/db/schema/expenses";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import { type BillGroup, type BillGroupId } from "@/lib/db/schema/billGroups";
import { Category, CategoryId } from "@/lib/db/schema/categories";

export default function OptimisticExpense({
  expense,
  billGroups,
  billGroupId,
  categories,
  categoryId,
}: {
  expense: Expense;
  billGroups: BillGroup[];
  billGroupId?: BillGroupId;
  categories: Category[];
  categoryId?: CategoryId;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Expense) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticExpense, setOptimisticExpense] = useOptimistic(expense);
  const updateExpense: TAddOptimistic = (input) =>
    setOptimisticExpense({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ExpenseForm
          expense={optimisticExpense}
          billGroups={billGroups}
          billGroupId={billGroupId}
          categories={categories}
          categoryId={categoryId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateExpense}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticExpense.amount}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticExpense.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticExpense, null, 2)}
      </pre>
    </div>
  );
}
