import { File } from "@prisma/client";
import React, { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";
import { UIPreviewError } from "@/components/elements/files/ui-preview/client/error";
import { UIPreview } from "@/components/elements/files/ui-preview/server";
import { UIPreviewLoading } from "@/components/elements/files/ui-preview/server/loading";
import { MultipleBrightCode } from "@/components/ui/bright-code";
import { MultipleCopyButton } from "@/components/ui/multiple-copy-button";
import {
  NavigateTabs,
  NavigateTabsTrigger,
  TabsContent,
  TabsList,
} from "@/components/ui/tabs";
import { getFiles } from "@/services/files/get";

export async function FilePreviews({
  files,
  name,
}: {
  files: File[];
  name: string;
}) {
  const objects = await getFiles(files);

  return (
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
        <div className="relative">
          <MultipleCopyButton
            items={objects.map((object) => ({
              label: object.extension,
              value: object.file,
            }))}
          />
        </div>
      </TabsList>
      <TabsContent value="preview">
        <ErrorBoundary FallbackComponent={UIPreviewError}>
          <Suspense fallback={<UIPreviewLoading name={name} />}>
            <UIPreview name={name} objects={objects} />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>
      <TabsContent value="code">
        <MultipleBrightCode objects={objects} />
      </TabsContent>
    </NavigateTabs>
  );
}
