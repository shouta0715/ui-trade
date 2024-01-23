"use client";

import React, { Suspense } from "react";

import { PreviewDropZone } from "@/app/(edit)/components/[slug]/edit/_components/client/drop-zones";

import { CategoryForm } from "@/app/(edit)/components/[slug]/edit/_components/client/form/summary/category-selector";
import { useSummaryForm } from "@/app/(edit)/components/[slug]/edit/_hooks/hooks/form/summary";
import { EditSummaryInput } from "@/app/(edit)/components/[slug]/edit/_hooks/schema/summary";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { InputLength } from "@/components/ui/input-length";
import { Label } from "@/components/ui/label";
import { AutoSizeTextarea, Textarea } from "@/components/ui/textarea";

type EditSummaryFormProps = {
  defaultValues: EditSummaryInput;
};

export function EditSummaryForm({ defaultValues }: EditSummaryFormProps) {
  const {
    control,
    register,
    errors,
    onDropAccepted,
    onDropRejected,
    handleSubmit,
    setValue,
  } = useSummaryForm(defaultValues);

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={handleSubmit((d) => {
        console.log(d);
      })}
    >
      {/* Category Input Form Server Components */}
      <Suspense fallback="loading">
        <fieldset>
          <CategoryForm
            control={control}
            setCategory={(value) => setValue("categoryName", value)}
          />
          <ErrorMessage className="mt-1">
            {errors.categoryName?.message}
          </ErrorMessage>
        </fieldset>
      </Suspense>

      {/* Name Input Form Client Components */}

      <fieldset className="grid gap-3">
        <Label htmlFor="name" required>
          Name
          <InputLength
            className="mx-2"
            control={control}
            maxLength={50}
            name="name"
          />
        </Label>

        <div className="mb-px border-b py-3 focus-within:mb-0 focus-within:border-b-2 focus-within:border-b-primary">
          <AutoSizeTextarea
            className="flex h-7 w-full resize-none items-center bg-background text-xl placeholder:text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue={defaultValues.name}
            placeholder="Untitled Component"
            {...register("name")}
            maxRows={4}
            minRows={1}
          />
        </div>
        {errors.name?.message && (
          <ErrorMessage className="mt-1">{errors.name?.message}</ErrorMessage>
        )}
      </fieldset>

      {/* Description Input Form Client Components */}
      <fieldset className="grid gap-3">
        <Label htmlFor="description">
          Description
          <InputLength
            className="mx-2"
            control={control}
            maxLength={200}
            name="description"
          />
        </Label>
        <Textarea
          className="min-h-32"
          defaultValue={defaultValues.description ?? ""}
          id="description"
          placeholder="description"
          {...register("description")}
        />
        {errors.description?.message && (
          <ErrorMessage className="mt-1">
            {errors.description?.message}
          </ErrorMessage>
        )}
      </fieldset>

      {/* Preview Image Input Form Client Components */}
      <fieldset className="grid gap-3">
        <Label htmlFor="categoryId" required>
          Preview Image
        </Label>
        <PreviewDropZone
          isError={errors.previewUrl?.value?.type === "min_length"}
          onDropAccepted={onDropAccepted}
          onDropRejected={onDropRejected}
        />
        {errors.previewUrl?.value?.message && (
          <ErrorMessage className="mt-1">
            {errors.previewUrl?.value?.message}
          </ErrorMessage>
        )}
      </fieldset>
      <Button type="submit">Save</Button>
    </form>
  );
}