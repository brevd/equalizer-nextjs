
import { type BillGroup, type CompleteBillGroup } from "@/lib/db/schema/billGroups";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<BillGroup>) => void;

export const useOptimisticBillGroups = (
  billGroups: CompleteBillGroup[],
  
) => {
  const [optimisticBillGroups, addOptimisticBillGroup] = useOptimistic(
    billGroups,
    (
      currentState: CompleteBillGroup[],
      action: OptimisticAction<BillGroup>,
    ): CompleteBillGroup[] => {
      const { data } = action;

      

      const optimisticBillGroup = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticBillGroup]
            : [...currentState, optimisticBillGroup];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticBillGroup } : item,
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

  return { addOptimisticBillGroup, optimisticBillGroups };
};
