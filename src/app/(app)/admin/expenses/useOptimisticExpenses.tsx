import { type BillGroup } from "@/lib/db/schema/billGroups";
import { type Expense, type CompleteExpense } from "@/lib/db/schema/expenses";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Expense>) => void;

export const useOptimisticExpenses = (
  expenses: CompleteExpense[],
  billGroups: BillGroup[]
) => {
  const [optimisticExpenses, addOptimisticExpense] = useOptimistic(
    expenses,
    (
      currentState: CompleteExpense[],
      action: OptimisticAction<Expense>,
    ): CompleteExpense[] => {
      const { data } = action;

      const optimisticBillGroup = billGroups.find(
        (billGroup) => billGroup.id === data.billGroupId,
      )!;

      const optimisticExpense = {
        ...data,
        billGroup: optimisticBillGroup,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticExpense]
            : [...currentState, optimisticExpense];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticExpense } : item,
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

  return { addOptimisticExpense, optimisticExpenses };
};
