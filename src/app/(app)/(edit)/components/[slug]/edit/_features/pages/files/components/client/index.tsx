"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { DuringSaveLoader } from "@/app/(app)/(edit)/components/[slug]/edit/_features/common/components/client/loaders";
import { EditSectionTitle } from "@/app/(app)/(edit)/components/[slug]/edit/_features/common/components/server/title";
import { FunctionNameInput } from "@/app/(app)/(edit)/components/[slug]/edit/_features/pages/files/components/client/function-name-input";
import { FileNavigationLoading } from "@/app/(app)/(edit)/components/[slug]/edit/_features/pages/files/components/client/loading";
import { FilesStatus } from "@/app/(app)/(edit)/components/[slug]/edit/_features/pages/files/components/client/status";
import { TogglePreviewType } from "@/app/(app)/(edit)/components/[slug]/edit/_features/pages/files/components/client/toggle-preview-type";
import { useFilesForm } from "@/app/(app)/(edit)/components/[slug]/edit/_features/pages/files/hooks";
import { NextSectionButton } from "@/app/(app)/(edit)/components/[slug]/edit/_features/section/components/client/next-section-button";
import { UIPreviewError } from "@/components/elements/files/ui-preview/client/error";
import { EditFilesInput } from "@/lib/schema/client/edit/files";

const DynamicEditFilesNavigate = dynamic(
  () =>
    import(
      "@/app/(app)/(edit)/components/[slug]/edit/_features/pages/files/components/client/navigation"
    ),
  {
    ssr: false,
    loading: () => <FileNavigationLoading />,
  }
);

const DynamicDuringComponentSave = dynamic(
  () =>
    import(
      "@/app/(app)/(edit)/components/[slug]/edit/_features/common/components/client/during-save"
    ),
  {
    ssr: false,
    loading: () => <DuringSaveLoader />,
  }
);

type EditFileFormProps = {
  defaultValues: EditFilesInput;
  name: string;
};

export function EditFileForm({ defaultValues, name }: EditFileFormProps) {
  const {
    control,
    slug,
    isDirty,
    status,
    isAllSuccess,
    errors,
    defaultValuesForm,
    isPending,
    handleDuringSave,
    setFiles,
    setError,
    setPreviewType,
    onSubmitHandler,
    onCompleteFunctionName,
  } = useFilesForm(defaultValues);

  return (
    <>
      <DynamicDuringComponentSave
        handleDuringSave={handleDuringSave}
        isDirty={isDirty}
        isPending={isPending}
        name={name}
      />

      <EditSectionTitle>
        <span className="px-2 font-black">UI</span>のファイルの投稿
      </EditSectionTitle>

      <form className="mt-8 space-y-8" onSubmit={onSubmitHandler}>
        <div className="flex flex-col justify-between gap-x-4 space-y-8 md:flex-row md:space-y-0">
          <TogglePreviewType
            control={control}
            defaultType={defaultValuesForm?.previewType?.type}
            setPreviewType={setPreviewType}
          />
          <FunctionNameInput
            control={control}
            defaultValues={defaultValuesForm}
            errors={errors}
            onCompleteFunctionName={onCompleteFunctionName}
          />
        </div>
        <ErrorBoundary FallbackComponent={UIPreviewError}>
          <Suspense fallback={<FileNavigationLoading />}>
            <DynamicEditFilesNavigate
              controls={control}
              errors={errors}
              isAllSuccess={isAllSuccess}
              isLoading={false}
              setError={setError}
              setFiles={setFiles}
              slug={slug}
            />
          </Suspense>
        </ErrorBoundary>
        <FilesStatus status={status} />
        <NextSectionButton
          currentSection="files"
          isDirty={isDirty}
          isLoading={isPending}
        />
      </form>
    </>
  );
}
