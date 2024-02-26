import React, { Suspense } from "react";

import { Control, FieldErrors, UseFormSetError } from "react-hook-form";
import { accepts } from "@/app/(edit)/components/[slug]/edit/_features/drop-zone/utils";
import { AcceptedFiles } from "@/app/(edit)/components/[slug]/edit/_features/files/components/client/files-info";
import { DropZoneNavigate } from "@/app/(edit)/components/[slug]/edit/_features/files/components/client/navigation/drop-zone";
import { PreviewsNavigate } from "@/app/(edit)/components/[slug]/edit/_features/files/components/client/navigation/preview";
import { usePreviewNavigation } from "@/app/(edit)/components/[slug]/edit/_features/files/hooks/navigation";

import { UIPreviewLoading } from "@/components/elements/files/ui-preview/client/loading";
import { Button } from "@/components/ui/button";
import {
  NavigateTabs,
  NavigateTabsTrigger,
  TabsList,
} from "@/components/ui/tabs";
import { EditFilesInput } from "@/lib/schema/client/edit/files";

type EditFileNavigateProps = {
  controls: Control<EditFilesInput>;
  slug: string;
  isLoading: boolean;
  isAllSuccess: boolean;
  errors: FieldErrors<EditFilesInput>;
  setFiles: (files: EditFilesInput["files"]) => void;
  setError: UseFormSetError<EditFilesInput>;
};

function EditFileNavigate({
  controls,
  slug,
  isLoading,
  isAllSuccess,
  errors,
  setFiles,
  setError,
}: EditFileNavigateProps) {
  const {
    hasFiles,
    files,
    isDragActive,
    functionName,
    getRootProps,
    getInputProps,
    onDeleteFile,
    open,
  } = usePreviewNavigation({
    controls,
    setFiles,
    setError,
  });

  return (
    <div className="grid gap-4">
      <NavigateTabs className="grid gap-8" defaultValue="preview">
        <TabsList className="h-9 w-full justify-between rounded-none border-b bg-transparent p-0 dark:border-b-gray-700">
          <div>
            <NavigateTabsTrigger
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent transition-none data-[state=active]:border-b-primary"
              value="preview"
            >
              Preview
            </NavigateTabsTrigger>
            <NavigateTabsTrigger
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent transition-none data-[state=active]:border-b-primary"
              value="code"
            >
              Code
            </NavigateTabsTrigger>
          </div>
        </TabsList>
        <div
          {...getRootProps({
            disabled: isLoading,
            id: "files",
            type: "file",
            name: "files",
            accept: accepts.files,
            "aria-label": "Upload a file",
          })}
          className="flex flex-col gap-4"
        >
          {hasFiles ? (
            <Suspense
              fallback={<UIPreviewLoading className="mt-2" name="edit" />}
            >
              <PreviewsNavigate
                files={files}
                functionName={functionName}
                getInputProps={getInputProps}
                isAllSuccess={isAllSuccess}
                isDragActive={isDragActive}
                isLoading={isLoading}
                onDeleteFile={onDeleteFile}
                slug={slug}
              />
            </Suspense>
          ) : (
            <DropZoneNavigate
              files={files}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
              isLoading={isLoading}
              onDeleteFile={onDeleteFile}
            />
          )}
        </div>
      </NavigateTabs>
      {errors.files && (
        <p className="text-sm text-destructive">{errors.files.message}</p>
      )}
      <div>
        <Button
          className="font-semibold"
          onClick={open}
          size="sm"
          type="button"
        >
          ファイルを選択
        </Button>
        <div className="mt-4">
          <AcceptedFiles
            files={files}
            onDeleteFile={onDeleteFile}
            suffix="global-check-files"
          />
        </div>
      </div>
    </div>
  );
}

export default EditFileNavigate;