
import { type BillMate, type CompleteBillMate } from "@/lib/db/schema/billMates";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<BillMate>) => void;

export const useOptimisticBillMates = (
  billMates: CompleteBillMate[],
  
) => {
  const [optimisticBillMates, addOptimisticBillMate] = useOptimistic(
    billMates,
    (
      currentState: CompleteBillMate[],
      action: OptimisticAction<BillMate>,
    ): CompleteBillMate[] => {
      const { data } = action;

      

      const optimisticBillMate = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticBillMate]
            : [...currentState, optimisticBillMate];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticBillMate } : item,
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

  return { addOptimisticBillMate, optimisticBillMates };
};
