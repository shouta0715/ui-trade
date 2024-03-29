/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import { getSignedPostUrl } from "./s3";

function loadFiles(name: string = "index"): Buffer {
  const baseFolder = `${process.cwd()}/prisma/seed/fixtures/assets/images`;

  const filePath = path.join(baseFolder, `${name}.png`);

  return fs.readFileSync(filePath);
}

export async function uploadImage(name: string = "index"): Promise<{
  id: string;
}> {
  const { url, fields, id } = await getSignedPostUrl(
    "image/png",
    "png",
    "ui-trade-preview"
  );

  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const file = loadFiles(name);

  formData.append("file", new Blob([file], { type: "image/png" }));

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    console.log(response);
    throw new Error("Failed to upload file");
  }

  return {
    id,
  };
}
