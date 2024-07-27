import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/splits/useOptimisticSplits";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Split, insertSplitParams } from "@/lib/db/schema/splits";
import {
  createSplitAction,
  deleteSplitAction,
  updateSplitAction,
} from "@/lib/actions/splits";
import { type BillMate, type BillMateId } from "@/lib/db/schema/billMates";
import { type Expense, type ExpenseId } from "@/lib/db/schema/expenses";

const SplitForm = ({
  billMates,
  billMateId,
  expenses,
  expenseId,
  split,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  split?: Split | null;
  billMates: BillMate[];
  billMateId?: BillMateId;
  expenses: Expense[];
  expenseId?: ExpenseId;
  openModal?: (split?: Split) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Split>(insertSplitParams);
  const editing = !!split?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("splits");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Split }
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Split ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const splitParsed = await insertSplitParams.safeParseAsync({
      billMateId,
      expenseId,
      ...payload,
    });
    if (!splitParsed.success) {
      setErrors(splitParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = splitParsed.data;
    const pendingSplit: Split = {
      updatedAt:
        split?.updatedAt ??
        new Date().toISOString().slice(0, 19).replace("T", " "),
      createdAt:
        split?.createdAt ??
        new Date().toISOString().slice(0, 19).replace("T", " "),
      id: split?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingSplit,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateSplitAction({ ...values, id: split.id })
          : await createSplitAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingSplit,
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.paid ? "text-destructive" : ""
          )}
        >
          Paid
        </Label>
        <Input
          type="text"
          name="paid"
          className={cn(errors?.paid ? "ring ring-destructive" : "")}
          defaultValue={split?.paid ?? ""}
        />
        {errors?.paid ? (
          <p className="text-xs text-destructive mt-2">{errors.paid[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.responsible ? "text-destructive" : ""
          )}
        >
          Responsible
        </Label>
        <Input
          type="text"
          name="responsible"
          className={cn(errors?.responsible ? "ring ring-destructive" : "")}
          defaultValue={split?.responsible ?? ""}
        />
        {errors?.responsible ? (
          <p className="text-xs text-destructive mt-2">
            {errors.responsible[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {billMateId ? null : (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.billMateId ? "text-destructive" : ""
            )}
          >
            BillMate
          </Label>
          <Select defaultValue={split?.billMateId} name="billMateId">
            <SelectTrigger
              className={cn(errors?.billMateId ? "ring ring-destructive" : "")}
            >
              <SelectValue placeholder="Select a billMate" />
            </SelectTrigger>
            <SelectContent>
              {billMates?.map((billMate) => (
                <SelectItem key={billMate.id} value={billMate.id.toString()}>
                  {billMate.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.billMateId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.billMateId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}

      {expenseId ? null : (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.expenseId ? "text-destructive" : ""
            )}
          >
            Expense
          </Label>
          <Select defaultValue={split?.expenseId} name="expenseId">
            <SelectTrigger
              className={cn(errors?.expenseId ? "ring ring-destructive" : "")}
            >
              <SelectValue placeholder="Select a expense" />
            </SelectTrigger>
            <SelectContent>
              {expenses?.map((expense) => (
                <SelectItem key={expense.id} value={expense.id.toString()}>
                  {expense.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.expenseId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.expenseId[0]}
            </p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      )}
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: split });
              const error = await deleteSplitAction(split.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: split,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default SplitForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
