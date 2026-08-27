import { createServerFn } from "@tanstack/react-start";

export const getConfig = createServerFn({ method: "GET" }).handler(async () => {
  // import dynamique pour rester server-only et lire env à chaque requête (runtime)
  const { getBaseUrl, getHost } = await import("@lib/config");
  return {
    host: getHost(),
    baseUrl: getBaseUrl(),
  };
});
