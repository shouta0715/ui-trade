"use client";

/* eslint-disable no-nested-ternary */
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { AlertCircle, CheckCircle2, Loader2, Pencil } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { DonNotSaveAlert } from "@/app/(app)/(edit)/components/[slug]/edit/_features/common/components/client/breadcrumbs/alert";
import {
  editPaths,
  editStatusAtom,
  isEditingAtom,
  isPendingEditAtom,
} from "@/app/(app)/(edit)/components/[slug]/edit/_features/section/contexts";
import { useRedirectSectionHandler } from "@/app/(app)/(edit)/components/[slug]/edit/_features/section/hooks";
import {
  EditStatusValue,
  EditingSteps,
} from "@/app/(app)/(edit)/components/[slug]/edit/_features/section/types";
import { paramsToEditingStep } from "@/app/(app)/(edit)/components/[slug]/edit/_features/section/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SelectStep({
  name,
  isPending,
  status,
  active,
  setOpenAlert,
  openAlert,
}: {
  name: EditingSteps;
  isPending: boolean;
  status: EditStatusValue;
  active: boolean;
  setOpenAlert: (value: boolean) => void;
  openAlert: boolean;
}) {
  const { onRedirect } = useRedirectSectionHandler();

  return (
    <>
      <DonNotSaveAlert
        onRedirect={() => onRedirect(name)}
        open={openAlert}
        setOpenAlert={setOpenAlert}
      />
      <SelectItem
        className="group w-full flex-1 focus:bg-primary focus:text-background"
        disabled={isPending}
        value={name}
      >
        <span className="flex items-center">
          {status === "CREATED" ? (
            <CheckCircle2 className="mr-2 size-5 text-success" />
          ) : status === "EDITING" ? (
            <Pencil className="mr-2 size-5 text-current" />
          ) : status === "LOADING" ? (
            <Loader2 className="mr-2 size-5 animate-spin text-current" />
          ) : status === "EMPTY" ? (
            <AlertCircle className="mr-2 size-5 text-muted-foreground group-hover:text-current" />
          ) : null}
          <span
            className={clsx(
              "capitalize",
              active
                ? " font-semibold text-current"
                : "text-muted-foreground group-focus:text-current"
            )}
          >
            {isPending || status === "LOADING" ? `Saving...` : name}
          </span>
        </span>
      </SelectItem>
    </>
  );
}

function MobileComponentBreadcrumbs() {
  // Alert
  const [openAlertState, setOpenAlertState] = React.useState<{
    [key in EditingSteps]: boolean;
  }>({
    summary: false,
    files: false,
    document: false,
  });

  // sections
  const { onRedirect } = useRedirectSectionHandler();
  const searchParams = useSearchParams();
  const currentSection = paramsToEditingStep(searchParams.get("section"));

  // atoms
  const values = useAtomValue(editStatusAtom);
  const isPending = useAtomValue(isPendingEditAtom);
  const isEditing = useAtomValue(isEditingAtom);

  return (
    <Select
      defaultValue={currentSection}
      onValueChange={(value: EditingSteps) => {
        if (isEditing) {
          setOpenAlertState((prev) => ({ ...prev, [value]: true }));
        } else {
          onRedirect(value);
        }
      }}
      value={currentSection}
    >
      <SelectTrigger className="relative flex rounded-none border-none p-0 px-2 capitalize focus:ring-0 [&_span]:flex-1">
        <SelectValue
          className="flex flex-1 text-primary"
          placeholder="選択してください"
        />
        <span
          aria-hidden="true"
          className={clsx(
            "bg-destructive",
            "absolute inset-x-0 -bottom-2  h-0.5"
          )}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup className="space-y-3">
          <SelectLabel>編集する内容を選択してください</SelectLabel>
          {editPaths.map(({ name }) => {
            return (
              <SelectStep
                key={name}
                active={currentSection === name}
                isPending={isPending}
                name={name}
                openAlert={openAlertState[name]}
                setOpenAlert={(value) => {
                  setOpenAlertState((prev) => ({ ...prev, [name]: value }));
                }}
                status={values[name].status}
              />
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default MobileComponentBreadcrumbs;
