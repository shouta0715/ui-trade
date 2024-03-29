import { File } from "@prisma/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  DefaultFileType,
  EditFilesInput,
  InputFileType,
} from "@/lib/schema/client/edit/files";
import { FileObject, getFiles } from "@/services/files/get";

type TransformFileObjectsProps = {
  slug: string;
  files: EditFilesInput["files"];
};

async function transformDefaultFiles(
  files: DefaultFileType[],
  slug: string
): Promise<FileObject[]> {
  const targetFiles: Omit<File, "id">[] = files.map((file) => ({
    objectId: file.objectId,
    extension: file.extension,
    componentId: slug,
    name: file.name,
  }));
  const defaultFiles = await getFiles(targetFiles);

  return defaultFiles;
}

async function transformInputFiles(
  files: InputFileType[],
  slug: string
): Promise<FileObject[]> {
  const fileValues = files.map(async (file) => {
    const content = await file.value.text();

    return {
      componentId: slug,
      file: content,
      extension: file.extension,
      id: file.objectId,
      name: file.name,
    };
  });

  const inputFiles = await Promise.all(fileValues);

  return inputFiles;
}

type PartitionedFiles = {
  defaultFiles: DefaultFileType[];
  inputFiles: InputFileType[];
};

async function transformFileObjects({
  slug,
  files,
}: TransformFileObjectsProps): Promise<FileObject[]> {
  const partitionedFiles: PartitionedFiles = {
    defaultFiles: [],
    inputFiles: [],
  };

  files.forEach((file) => {
    if (file.type === "default") {
      partitionedFiles.defaultFiles.push(file);
    } else {
      partitionedFiles.inputFiles.push(file);
    }
  });

  const fileObjects: FileObject[] = [];

  const { inputFiles, defaultFiles } = partitionedFiles;

  if (defaultFiles.length) {
    const transformed = await transformDefaultFiles(defaultFiles, slug);
    fileObjects.push(...transformed);
  }

  if (inputFiles.length) {
    const transformed = await transformInputFiles(inputFiles, slug);
    fileObjects.push(...transformed);
  }

  return fileObjects;
}

export function useQueryFileObjects({
  slug,
  files,
}: TransformFileObjectsProps) {
  const ids = files.map(({ objectId }) => objectId);

  const { data, isPending } = useSuspenseQuery({
    queryKey: ["fileObjects", { slug, ids }],
    queryFn: () => transformFileObjects({ slug, files }),
  });

  const hasPreviewFiles = useMemo(() => {
    if (!files) return false;
    const is = files.find(
      (file) =>
        file.extension === "html" ||
        file.extension === "tsx" ||
        file.extension === "jsx"
    );

    return is;
  }, [files]);

  return { data, isPending, hasPreviewFiles };
}
