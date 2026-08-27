import { createError, defineEventHandler, setHeader } from "h3";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getBaseUrl } from "@lib/config";

export default defineEventHandler(async (event) => {
  const baseUrl = getBaseUrl();
  const candidates = [
    join(process.cwd(), "public/sh/tree.sh"),
    join(process.cwd(), "../public/sh/tree.sh"),
    join(process.cwd(), "../../public/sh/tree.sh"),
  ];
  let script = "";
  for (const p of candidates) {
    try { script = await readFile(p, "utf8"); break; } catch {}
  }
  if (!script) {
    throw createError({ statusCode: 500, statusMessage: "public/sh/tree.sh not found" });
  }
  script = script.replace(/BASE_URL="\$\{BASE_URL:-.*?}"/, `BASE_URL="\${BASE_URL:-${baseUrl}}"`);
  setHeader(event, "content-type", "text/x-shellscript; charset=utf-8");
  setHeader(event, "cache-control", "public, max-age=60");
  return script;
});
