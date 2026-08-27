import * as v from "valibot";

// --- Tree schemas (réutilisables côté client + ServerFn) ---
export const HexColorSchema = v.pipe(v.string(), v.regex(/^#[0-9a-fA-F]{6}$/, "hex color #rrggbb attendu"));

export const ThemeNameSchema = v.picklist(["dark", "light", "paper"] as const);

export const TreeContentSchema = v.pipe(v.string(), v.minLength(1, "content vide"), v.maxLength(100_000, "100KB max"));

// Helper Standard Schema compatible (valibot l'est déjà)
