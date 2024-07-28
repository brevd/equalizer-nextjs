import { type BillMate } from "@/lib/db/schema/billMates";
import { type Expense } from "@/lib/db/schema/expenses";
import { type Split, type CompleteSplit } from "@/lib/db/schema/splits";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Split>) => void;

export const useOptimisticSplits = (
  splits: CompleteSplit[],
  billMates: BillMate[],
  expenses: Expense[]
) => {
  const [optimisticSplits, addOptimisticSplit] = useOptimistic(
    splits,
    (
      currentState: CompleteSplit[],
      action: OptimisticAction<Split>,
    ): CompleteSplit[] => {
      const { data } = action;

      const optimisticBillMate = billMates.find(
        (billMate) => billMate.id === data.billMateId,
      )!;

      const optimisticExpense = expenses.find(
        (expense) => expense.id === data.expenseId,
      )!;

      const optimisticSplit = {
        ...data,
        billMate: optimisticBillMate,
       expense: optimisticExpense,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticSplit]
            : [...currentState, optimisticSplit];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticSplit } : item,
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

  return { addOptimisticSplit, optimisticSplits };
};
