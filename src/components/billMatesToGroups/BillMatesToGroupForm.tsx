import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/bill-mates-to-groups/useOptimisticBillMatesToGroups";

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

import { type BillMatesToGroup, insertBillMatesToGroupParams } from "@/lib/db/schema/billMatesToGroups";
import {
  createBillMatesToGroupAction,
  deleteBillMatesToGroupAction,
  updateBillMatesToGroupAction,
} from "@/lib/actions/billMatesToGroups";
import { type BillGroup, type BillGroupId } from "@/lib/db/schema/billGroups";
import { type BillMate, type BillMateId } from "@/lib/db/schema/billMates";

const BillMatesToGroupForm = ({
  billGroups,
  billGroupId,
  billMates,
  billMateId,
  billMatesToGroup,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  billMatesToGroup?: BillMatesToGroup | null;
  billGroups: BillGroup[];
  billGroupId?: BillGroupId
  billMates: BillMate[];
  billMateId?: BillMateId
  openModal?: (billMatesToGroup?: BillMatesToGroup) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<BillMatesToGroup>(insertBillMatesToGroupParams);
  const editing = !!billMatesToGroup?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("bill-mates-to-groups");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: BillMatesToGroup },
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
      toast.success(`BillMatesToGroup ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const billMatesToGroupParsed = await insertBillMatesToGroupParams.safeParseAsync({ billGroupId,
  billMateId, ...payload });
    if (!billMatesToGroupParsed.success) {
      setErrors(billMatesToGroupParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = billMatesToGroupParsed.data;
    const pendingBillMatesToGroup: BillMatesToGroup = {
      updatedAt: billMatesToGroup?.updatedAt ?? new Date().toISOString().slice(0, 19).replace("T", " "),
      createdAt: billMatesToGroup?.createdAt ?? new Date().toISOString().slice(0, 19).replace("T", " "),
      id: billMatesToGroup?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingBillMatesToGroup,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateBillMatesToGroupAction({ ...values, id: billMatesToGroup.id })
          : await createBillMatesToGroupAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingBillMatesToGroup 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
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
      
      {billGroupId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.billGroupId ? "text-destructive" : "",
          )}
        >
          BillGroup
        </Label>
        <Select defaultValue={billMatesToGroup?.billGroupId} name="billGroupId">
          <SelectTrigger
            className={cn(errors?.billGroupId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a billGroup" />
          </SelectTrigger>
          <SelectContent>
          {billGroups?.map((billGroup) => (
            <SelectItem key={billGroup.id} value={billGroup.id.toString()}>
              {billGroup.id}{/* TODO: Replace with a field from the billGroup model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.billGroupId ? (
          <p className="text-xs text-destructive mt-2">{errors.billGroupId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> }

      {billMateId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.billMateId ? "text-destructive" : "",
          )}
        >
          BillMate
        </Label>
        <Select defaultValue={billMatesToGroup?.billMateId} name="billMateId">
          <SelectTrigger
            className={cn(errors?.billMateId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a billMate" />
          </SelectTrigger>
          <SelectContent>
          {billMates?.map((billMate) => (
            <SelectItem key={billMate.id} value={billMate.id.toString()}>
              {billMate.id}{/* TODO: Replace with a field from the billMate model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.billMateId ? (
          <p className="text-xs text-destructive mt-2">{errors.billMateId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> }
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
              addOptimistic && addOptimistic({ action: "delete", data: billMatesToGroup });
              const error = await deleteBillMatesToGroupAction(billMatesToGroup.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: billMatesToGroup,
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

export default BillMatesToGroupForm;

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
