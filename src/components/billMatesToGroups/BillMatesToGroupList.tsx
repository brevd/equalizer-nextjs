"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  type BillMatesToGroup,
  CompleteBillMatesToGroup,
} from "@/lib/db/schema/billMatesToGroups";
import Modal from "@/components/shared/Modal";
import { type BillGroup, type BillGroupId } from "@/lib/db/schema/billGroups";
import { type BillMate, type BillMateId } from "@/lib/db/schema/billMates";
import { useOptimisticBillMatesToGroups } from "@/app/(app)/admin/bill-mates-to-groups/useOptimisticBillMatesToGroups";
import { Button } from "@/components/ui/button";
import BillMatesToGroupForm from "./BillMatesToGroupForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (billMatesToGroup?: BillMatesToGroup) => void;

export default function BillMatesToGroupList({
  billMatesToGroups,
  billGroups,
  billGroupId,
  billMates,
  billMateId,
}: {
  billMatesToGroups: CompleteBillMatesToGroup[];
  billGroups: BillGroup[];
  billGroupId?: BillGroupId;
  billMates: BillMate[];
  billMateId?: BillMateId;
}) {
  const { optimisticBillMatesToGroups, addOptimisticBillMatesToGroup } =
    useOptimisticBillMatesToGroups(billMatesToGroups, billGroups, billMates);
  const [open, setOpen] = useState(false);
  const [activeBillMatesToGroup, setActiveBillMatesToGroup] =
    useState<BillMatesToGroup | null>(null);
  const openModal = (billMatesToGroup?: BillMatesToGroup) => {
    setOpen(true);
    billMatesToGroup
      ? setActiveBillMatesToGroup(billMatesToGroup)
      : setActiveBillMatesToGroup(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={
          activeBillMatesToGroup
            ? "Edit BillMatesToGroup"
            : "Create Bill Mates To Group"
        }
      >
        <BillMatesToGroupForm
          billMatesToGroup={activeBillMatesToGroup}
          addOptimistic={addOptimisticBillMatesToGroup}
          openModal={openModal}
          closeModal={closeModal}
          billGroups={billGroups}
          billGroupId={billGroupId}
          billMates={billMates}
          billMateId={billMateId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticBillMatesToGroups.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticBillMatesToGroups.map((billMatesToGroup) => (
            <BillMatesToGroup
              billMatesToGroup={billMatesToGroup}
              key={billMatesToGroup.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const BillMatesToGroup = ({
  billMatesToGroup,
  openModal,
}: {
  billMatesToGroup: CompleteBillMatesToGroup;
  openModal: TOpenModal;
}) => {
  const optimistic = billMatesToGroup.id === "optimistic";
  const deleting = billMatesToGroup.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("bill-mates-to-groups")
    ? pathname
    : pathname + "/bill-mates-to-groups/";

  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : ""
      )}
    >
      <div className="w-full">
        <div>{billMatesToGroup.billGroupId}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={basePath + "/" + billMatesToGroup.id}>Edit</Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No bill mates to groups
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new bill mates to group.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Bill Mates To Groups{" "}
        </Button>
      </div>
    </div>
  );
};
