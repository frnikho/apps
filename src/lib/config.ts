import { env } from "@env";

function getRawHost(): string {
  // Runtime: process.env lu à chaque requête, pas la valeur figée au build
  const fromEnv = process.env.HOST?.trim() || process.env.APP_HOST?.trim();
  const raw = (fromEnv || env.HOST || "localhost:3000").trim();
  // Nitro met HOST=0.0.0.0 pour écouter → pas un host public
  if (raw === "0.0.0.0" || raw === "0.0.0.0:3000") {
    return (process.env.APP_HOST || "app.nikho.dev").trim();
  }
  return raw;
}

export function getBaseUrl(): string {
  const raw = getRawHost();
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw.replace(/\/$/, "");
  const isLocal = raw.startsWith("localhost") || raw.startsWith("127.0.0.1");
  return `${isLocal ? "http" : "https"}://${raw.replace(/\/$/, "")}`;
}

export function getHost(): string {
  return getRawHost();
}
