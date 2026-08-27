import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";

export const env = createEnv({
  server: {
    HOST: v.optional(v.pipe(v.string(), v.minLength(1)), "localhost:3000"),
  },
  clientPrefix: "PUBLIC_",
  client: {},
  // Runtime, pas buildtime: process.env lu à l'import. Fallback localhost pour que le build ne casse pas si HOST absent.
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: false,
});
