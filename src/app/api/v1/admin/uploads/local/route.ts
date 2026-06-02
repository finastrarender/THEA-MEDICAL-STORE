import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { auth } from "@/auth";
import { jsonData, jsonError } from "@/lib/api-response";

function sanitizeSegment(value: string) {
  return value
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^a-zA-Z0-9/_-]+/g, "-")
    .replace(/\/{2,}/g, "/");
}

function sanitizeFileName(value: string) {
  const clean = value
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-");
  return clean.length > 0 ? clean : "upload";
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("unauthorized", "Sign in required", 401);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("bad_request", "Invalid form data", 400);
  }

  const file = formData.get("file");
  const folderValue = String(formData.get("folder") ?? "");
  if (!(file instanceof File)) {
    return jsonError("validation_error", "File is required", 422);
  }

  const folder = sanitizeSegment(folderValue || "misc");
  const fileName = sanitizeFileName(file.name || "upload");
  const uniqueName = `${new Date().toISOString().slice(0, 10)}-${crypto.randomUUID()}-${fileName}`;
  const relativeDir = path.join("uploads", folder);
  const publicDir = path.join(process.cwd(), "public", relativeDir);
  const absolutePath = path.join(publicDir, uniqueName);

  try {
    await mkdir(publicDir, { recursive: true });
    const bytes = new Uint8Array(await file.arrayBuffer());
    await writeFile(absolutePath, bytes);
  } catch (error) {
    return jsonError(
      "upload_error",
      error instanceof Error ? error.message : "Failed to save upload",
      500,
    );
  }

  return jsonData({
    assetUrl: `/${relativeDir.replace(/\\/g, "/")}/${uniqueName}`,
  });
}
