import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PREVIEW_BUCKET_NAME } from "@/lib/constant";
import { Extension } from "@/types/file";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getContentType = (type: Extension) => {
  if (type === "tsx") {
    return "text/typescript-jsx";
  }

  if (type === "html") {
    return "text/html";
  }

  if (type === "css") {
    return "text/css";
  }

  if (type === "js") {
    return "text/javascript";
  }

  if (type === "jsx") {
    return "text/javascript-jsx";
  }

  return "text/typescript";
};

export const getImageUrl = (id: string) => {
  const endpoint = process.env.AWS_S3_ENDPOINT;

  return `${endpoint}/${PREVIEW_BUCKET_NAME}/${id}`;
};
