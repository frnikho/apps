import { existsSync, mkdirSync } from "node:fs";
import { readdir, readFile, writeFile, unlink } from "node:fs/promises";
import { join } from "node:path";

const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_CONTENT_BYTES = 100_000;
const DATA_DIR = join(process.cwd(), ".data", "tree");

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function idPath(id: string) {
  return join(DATA_DIR, `${id}.json`);
}

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function generateId(len = 6): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let id = "";
  for (let i = 0; i < len; i++) id += ALPHABET[bytes[i] % ALPHABET.length];
  return id;
}

export async function saveTree(content: string): Promise<string> {
  ensureDir();
  if (Buffer.byteLength(content, "utf8") > MAX_CONTENT_BYTES) throw new Error("CONTENT_TOO_LARGE");
  for (let attempt = 0; attempt < 5; attempt++) {
    const id = generateId(6);
    const p = idPath(id);
    if (!existsSync(p)) {
      const now = Date.now();
      await writeFile(p, JSON.stringify({ content, createdAt: now, expiresAt: now + TTL_MS }), "utf8");
      return id;
    }
  }
  const id = generateId(8);
  await writeFile(idPath(id), JSON.stringify({ content, createdAt: Date.now(), expiresAt: Date.now() + TTL_MS }), "utf8");
  return id;
}

export async function getTree(id: string): Promise<{ content: string; createdAt: number; expiresAt: number } | null> {
  if (!/^[A-Za-z0-9]{6,8}$/.test(id)) return null;
  const p = idPath(id);
  if (!existsSync(p)) return null;
  try {
    const raw = JSON.parse(await readFile(p, "utf8"));
    if (Date.now() > raw.expiresAt) {
      await unlink(p).catch(() => {});
      return null;
    }
    return raw;
  } catch {
    return null;
  }
}

export async function cleanupExpired(): Promise<void> {
  try {
    ensureDir();
    const files = await readdir(DATA_DIR);
    for (const f of files) {
      const p = join(DATA_DIR, f);
      try {
        const raw = JSON.parse(await readFile(p, "utf8"));
        if (Date.now() > raw.expiresAt) await unlink(p).catch(() => {});
      } catch {
        await unlink(p).catch(() => {});
      }
    }
  } catch {}
}
