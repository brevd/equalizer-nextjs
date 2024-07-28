"use client";

import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/admin/budgets/useOptimisticBudgets";

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

import { type Budget, insertBudgetParams } from "@/lib/db/schema/budgets";
import {
  createBudgetAction,
  deleteBudgetAction,
  updateBudgetAction,
} from "@/lib/actions/budgets";
import { type Category, type CategoryId } from "@/lib/db/schema/categories";

const BudgetForm = ({
  categories,
  categoryId,
  budget,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  budget?: Budget | null;
  categories: Category[];
  categoryId?: CategoryId;
  openModal?: (budget?: Budget) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Budget>(insertBudgetParams);
  const editing = !!budget?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("budgets");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Budget }
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
      toast.success(`Budget ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const budgetParsed = await insertBudgetParams.safeParseAsync({
      categoryId,
      ...payload,
    });
    if (!budgetParsed.success) {
      setErrors(budgetParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = budgetParsed.data;
    const pendingBudget: Budget = {
      updatedAt:
        budget?.updatedAt ??
        new Date().toISOString().slice(0, 19).replace("T", " "),
      createdAt:
        budget?.createdAt ??
        new Date().toISOString().slice(0, 19).replace("T", " "),
      id: budget?.id ?? "",
      userId: budget?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingBudget,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateBudgetAction({ ...values, id: budget.id })
          : await createBudgetAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingBudget,
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
            errors?.amount ? "text-destructive" : ""
          )}
        >
          Amount
        </Label>
        <Input
          type="text"
          name="amount"
          className={cn(errors?.amount ? "ring ring-destructive" : "")}
          defaultValue={budget?.amount ?? ""}
        />
        {errors?.amount ? (
          <p className="text-xs text-destructive mt-2">{errors.amount[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.period ? "text-destructive" : ""
            )}
          >
            Period
          </Label>
          <Input
            type="text"
            name="period"
            className={cn(errors?.period ? "ring ring-destructive" : "")}
            defaultValue={budget?.period ?? ""}
          />
          {errors?.period ? (
            <p className="text-xs text-destructive mt-2">{errors.period[0]}</p>
          ) : (
            <div className="h-6" />
          )}
        </div>
      ) */}

      {categoryId ? null : (
        <div>
          <Label
            className={cn(
              "mb-2 inline-block",
              errors?.categoryId ? "text-destructive" : ""
            )}
          >
            Category
          </Label>
          <Select defaultValue={budget?.categoryId} name="categoryId">
            <SelectTrigger
              className={cn(errors?.categoryId ? "ring ring-destructive" : "")}
            >
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.categoryId ? (
            <p className="text-xs text-destructive mt-2">
              {errors.categoryId[0]}
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
              addOptimistic &&
                addOptimistic({ action: "delete", data: budget });
              const error = await deleteBudgetAction(budget.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: budget,
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

export default BudgetForm;

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
