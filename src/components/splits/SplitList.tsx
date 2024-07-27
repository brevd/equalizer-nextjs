"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Split, CompleteSplit } from "@/lib/db/schema/splits";
import Modal from "@/components/shared/Modal";
import { type BillMate, type BillMateId } from "@/lib/db/schema/billMates";
import { type Expense, type ExpenseId } from "@/lib/db/schema/expenses";
import { useOptimisticSplits } from "@/app/(app)/splits/useOptimisticSplits";
import { Button } from "@/components/ui/button";
import SplitForm from "./SplitForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (split?: Split) => void;

export default function SplitList({
  splits,
  billMates,
  billMateId,
  expenses,
  expenseId 
}: {
  splits: CompleteSplit[];
  billMates: BillMate[];
  billMateId?: BillMateId;
  expenses: Expense[];
  expenseId?: ExpenseId 
}) {
  const { optimisticSplits, addOptimisticSplit } = useOptimisticSplits(
    splits,
    billMates,
  expenses 
  );
  const [open, setOpen] = useState(false);
  const [activeSplit, setActiveSplit] = useState<Split | null>(null);
  const openModal = (split?: Split) => {
    setOpen(true);
    split ? setActiveSplit(split) : setActiveSplit(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeSplit ? "Edit Split" : "Create Split"}
      >
        <SplitForm
          split={activeSplit}
          addOptimistic={addOptimisticSplit}
          openModal={openModal}
          closeModal={closeModal}
          billMates={billMates}
        billMateId={billMateId}
        expenses={expenses}
        expenseId={expenseId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticSplits.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticSplits.map((split) => (
            <Split
              split={split}
              key={split.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Split = ({
  split,
  openModal,
}: {
  split: CompleteSplit;
  openModal: TOpenModal;
}) => {
  const optimistic = split.id === "optimistic";
  const deleting = split.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("splits")
    ? pathname
    : pathname + "/splits/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{split.paid}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + split.id }>
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
        No splits
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new split.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Splits </Button>
      </div>
    </div>
  );
};
