import { createParser, parseAsStringLiteral } from "nuqs";
import * as v from "valibot";
import { HexColorSchema } from "./schemas";

// Theme: enum strict, fallback -> default via withDefault
export const themeParser = parseAsStringLiteral(["dark", "light", "paper"] as const).withDefault("dark");

// Alternative avec valibot si tu veux centraliser la source:
// export const themeParser = createParser({
//   parse: (v_raw) => v.parse(ThemeNameSchema, v_raw),
//   serialize: (v) => v,
// }).withDefault("dark");

// Hex color: valibot Standard Schema, throw -> nuqs fallback sur default (null)
export const hexParser = createParser({
  parse: (value: string) => {
    const out = v.safeParse(HexColorSchema, value);
    if (!out.success) throw new Error(out.issues[0].message);
    return out.output;
  },
  serialize: (value: string) => value,
});

// Pour usage futur avec parseAsJson + schema:
// import { parseAsJson } from "nuqs"
// export const themeConfigParser = parseAsJson(ThemeConfigSchema)
