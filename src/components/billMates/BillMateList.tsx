"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type BillMate, CompleteBillMate } from "@/lib/db/schema/billMates";
import Modal from "@/components/shared/Modal";

import { useOptimisticBillMates } from "@/app/(app)/bill-mates/useOptimisticBillMates";
import { Button } from "@/components/ui/button";
import BillMateForm from "./BillMateForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (billMate?: BillMate) => void;

export default function BillMateList({
  billMates,
   
}: {
  billMates: CompleteBillMate[];
   
}) {
  const { optimisticBillMates, addOptimisticBillMate } = useOptimisticBillMates(
    billMates,
     
  );
  const [open, setOpen] = useState(false);
  const [activeBillMate, setActiveBillMate] = useState<BillMate | null>(null);
  const openModal = (billMate?: BillMate) => {
    setOpen(true);
    billMate ? setActiveBillMate(billMate) : setActiveBillMate(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeBillMate ? "Edit BillMate" : "Create Bill Mate"}
      >
        <BillMateForm
          billMate={activeBillMate}
          addOptimistic={addOptimisticBillMate}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticBillMates.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticBillMates.map((billMate) => (
            <BillMate
              billMate={billMate}
              key={billMate.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const BillMate = ({
  billMate,
  openModal,
}: {
  billMate: CompleteBillMate;
  openModal: TOpenModal;
}) => {
  const optimistic = billMate.id === "optimistic";
  const deleting = billMate.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("bill-mates")
    ? pathname
    : pathname + "/bill-mates/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{billMate.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + billMate.id }>
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
        No bill mates
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new bill mate.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Bill Mates </Button>
      </div>
    </div>
  );
};
