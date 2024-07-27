"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Expense, CompleteExpense } from "@/lib/db/schema/expenses";
import Modal from "@/components/shared/Modal";
import { type BillGroup, type BillGroupId } from "@/lib/db/schema/billGroups";
import { useOptimisticExpenses } from "@/app/(app)/expenses/useOptimisticExpenses";
import { Button } from "@/components/ui/button";
import ExpenseForm from "./ExpenseForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (expense?: Expense) => void;

export default function ExpenseList({
  expenses,
  billGroups,
  billGroupId 
}: {
  expenses: CompleteExpense[];
  billGroups: BillGroup[];
  billGroupId?: BillGroupId 
}) {
  const { optimisticExpenses, addOptimisticExpense } = useOptimisticExpenses(
    expenses,
    billGroups 
  );
  const [open, setOpen] = useState(false);
  const [activeExpense, setActiveExpense] = useState<Expense | null>(null);
  const openModal = (expense?: Expense) => {
    setOpen(true);
    expense ? setActiveExpense(expense) : setActiveExpense(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeExpense ? "Edit Expense" : "Create Expense"}
      >
        <ExpenseForm
          expense={activeExpense}
          addOptimistic={addOptimisticExpense}
          openModal={openModal}
          closeModal={closeModal}
          billGroups={billGroups}
        billGroupId={billGroupId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticExpenses.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticExpenses.map((expense) => (
            <Expense
              expense={expense}
              key={expense.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Expense = ({
  expense,
  openModal,
}: {
  expense: CompleteExpense;
  openModal: TOpenModal;
}) => {
  const optimistic = expense.id === "optimistic";
  const deleting = expense.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("expenses")
    ? pathname
    : pathname + "/expenses/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{expense.amount}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + expense.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No expenses
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new expense.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Expenses </Button>
      </div>
    </div>
  );
};
