import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { TreeContentSchema } from "./schemas";

const TreeIdSchema = v.pipe(v.string(), v.regex(/^[A-Za-z0-9]{6,8}$/, "id invalide"));

type SaveResult = { id: string; url: string; expiresAt: number };

export const saveTreeShare = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object" || !("content" in data)) throw new Error("content required");
    const content = (data as Record<string, unknown>).content;
    const parsed = v.safeParse(TreeContentSchema, content);
    if (!parsed.success) throw new Error(parsed.issues[0].message);
    return { content: parsed.output };
  })
  .handler(async ({ data }): Promise<SaveResult> => {
    const { saveTree } = await import("../../server/utils/treeStore");
    const id = await saveTree(data.content);
    return { id, url: `/s/${id}`, expiresAt: Date.now() + 24 * 60 * 60 * 1000 };
  });

export const getTreeShare = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    if (!data || typeof data !== "object" || !("id" in data)) throw new Error("id required");
    const rawId = (data as Record<string, unknown>).id;
    const parsed = v.safeParse(TreeIdSchema, rawId);
    if (!parsed.success) throw new Error(parsed.issues[0].message);
    return { id: parsed.output };
  })
  .handler(async ({ data }) => {
    const { getTree } = await import("../../server/utils/treeStore");
    const found = await getTree(data.id);
    if (!found) throw new Error("not found or expired");
    return found;
  });
