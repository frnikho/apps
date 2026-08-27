export type Theme = {
  bg: string;
  fg: string;
  accent: string;
  radius: number;
  font: "mono" | "sans";
  showLineNumbers: boolean;
};

export const THEMES = {
  dark: { bg: "#0f0f0f", fg: "#e8e8e8", accent: "#a78bfa", radius: 16, font: "mono", showLineNumbers: false },
  light: { bg: "#ffffff", fg: "#1a1a1a", accent: "#7c3aed", radius: 16, font: "mono", showLineNumbers: false },
  paper: { bg: "#fdf6e3", fg: "#3d2b1f", accent: "#b58900", radius: 12, font: "mono", showLineNumbers: false },
} as const satisfies Record<string, Theme>;

export type ThemeName = keyof typeof THEMES;
