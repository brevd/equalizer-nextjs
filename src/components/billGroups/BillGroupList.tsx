"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type BillGroup, CompleteBillGroup } from "@/lib/db/schema/billGroups";
import Modal from "@/components/shared/Modal";

import { useOptimisticBillGroups } from "@/app/(app)/bill-groups/useOptimisticBillGroups";
import { Button } from "@/components/ui/button";
import BillGroupForm from "./BillGroupForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (billGroup?: BillGroup) => void;

export default function BillGroupList({
  billGroups,
   
}: {
  billGroups: CompleteBillGroup[];
   
}) {
  const { optimisticBillGroups, addOptimisticBillGroup } = useOptimisticBillGroups(
    billGroups,
     
  );
  const [open, setOpen] = useState(false);
  const [activeBillGroup, setActiveBillGroup] = useState<BillGroup | null>(null);
  const openModal = (billGroup?: BillGroup) => {
    setOpen(true);
    billGroup ? setActiveBillGroup(billGroup) : setActiveBillGroup(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeBillGroup ? "Edit BillGroup" : "Create Bill Group"}
      >
        <BillGroupForm
          billGroup={activeBillGroup}
          addOptimistic={addOptimisticBillGroup}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticBillGroups.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticBillGroups.map((billGroup) => (
            <BillGroup
              billGroup={billGroup}
              key={billGroup.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const BillGroup = ({
  billGroup,
  openModal,
}: {
  billGroup: CompleteBillGroup;
  openModal: TOpenModal;
}) => {
  const optimistic = billGroup.id === "optimistic";
  const deleting = billGroup.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("bill-groups")
    ? pathname
    : pathname + "/bill-groups/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{billGroup.title}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + billGroup.id }>
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
        No bill groups
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new bill group.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Bill Groups </Button>
      </div>
    </div>
  );
};
