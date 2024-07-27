import { type BillGroup } from "@/lib/db/schema/billGroups";
import { type BillMate } from "@/lib/db/schema/billMates";
import { type BillMatesToGroup, type CompleteBillMatesToGroup } from "@/lib/db/schema/billMatesToGroups";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<BillMatesToGroup>) => void;

export const useOptimisticBillMatesToGroups = (
  billMatesToGroups: CompleteBillMatesToGroup[],
  billGroups: BillGroup[],
  billMates: BillMate[]
) => {
  const [optimisticBillMatesToGroups, addOptimisticBillMatesToGroup] = useOptimistic(
    billMatesToGroups,
    (
      currentState: CompleteBillMatesToGroup[],
      action: OptimisticAction<BillMatesToGroup>,
    ): CompleteBillMatesToGroup[] => {
      const { data } = action;

      const optimisticBillGroup = billGroups.find(
        (billGroup) => billGroup.id === data.billGroupId,
      )!;

      const optimisticBillMate = billMates.find(
        (billMate) => billMate.id === data.billMateId,
      )!;

      const optimisticBillMatesToGroup = {
        ...data,
        billGroup: optimisticBillGroup,
       billMate: optimisticBillMate,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticBillMatesToGroup]
            : [...currentState, optimisticBillMatesToGroup];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticBillMatesToGroup } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticBillMatesToGroup, optimisticBillMatesToGroups };
};
