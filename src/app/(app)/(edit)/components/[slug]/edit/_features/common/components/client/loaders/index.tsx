import { Loader, Loader2 } from "lucide-react";
import React from "react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryFormLoader() {
  return (
    <div className="group inline-block">
      <Label required>UIのカテゴリーを選択</Label>
      <Skeleton
        aria-busy
        className="mt-3 inline-flex h-10 w-72 items-center justify-between rounded-md border border-input px-4 py-2 text-sm sm:w-80"
      >
        Loading...
        <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
      </Skeleton>
    </div>
  );
}

export function PreviewDropZoneLoader({ text = "Loading Preview Uploader" }) {
  return (
    <Skeleton className="relative flex h-96 justify-center rounded-lg  border border-dashed border-border px-4 pb-5 pt-10 sm:px-0 ">
      <div className="flex flex-col items-center justify-center">
        {/* children is Icons */}
        <Loader
          aria-hidden="true"
          className="mx-auto h-12 w-12 animate-spin text-gray-300 transition-colors duration-150 dark:text-gray-400"
        />

        {/* Input Zone */}
        <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
          <span className="flex items-center">
            <span>{text}</span>
          </span>
        </div>
      </div>
    </Skeleton>
  );
}

export const DuringSaveLoader = () => {
  return (
    <div className="sticky top-[57px] z-20 -mx-4 -mt-8 flex h-12 flex-1 items-center justify-between border-b border-border  bg-background px-2.5 py-2 sm:-mx-6 md:px-4 lg:-mx-8">
      <div className="flex h-full w-full items-center justify-end gap-x-4">
        <Skeleton className="h-full w-28" />
        <Skeleton className="h-full w-24" />
      </div>
    </div>
  );
};
