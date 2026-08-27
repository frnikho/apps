import { THEMES, type Theme } from "@lib/theme";

type ThemeName = keyof typeof THEMES;

type Props = {
  theme: Theme;
  themeKey: ThemeName;
  onThemeKey: (k: ThemeName) => void;
  onBg: (v: string | null) => void;
  onFg: (v: string | null) => void;
  onAccent: (v: string | null) => void;
  onReset: () => void;
};

export function ThemePanel({ theme, themeKey, onThemeKey, onBg, onFg, onAccent, onReset }: Props) {
  return (
    <div className="rounded-2xl border bg-zinc-900 border-zinc-800 p-4">
      <h3 className="text-sm font-semibold text-zinc-100">Thème (nuqs)</h3>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {(Object.keys(THEMES) as ThemeName[]).map((k) => (
          <button type="button" key={k} onClick={() => onThemeKey(k)} className={`rounded-xl border px-3 py-2 text-xs capitalize ${themeKey === k ? "bg-white text-black border-white" : "bg-zinc-800 text-zinc-300 border-zinc-700"}`}>
            {k}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <label className="text-xs text-zinc-400">
          Fond
          <input type="color" value={theme.bg} onChange={(e) => onBg(e.target.value)} className="mt-1 w-full h-8 rounded" />
        </label>
        <label className="text-xs text-zinc-400">
          Texte
          <input type="color" value={theme.fg} onChange={(e) => onFg(e.target.value)} className="mt-1 w-full h-8 rounded" />
        </label>
        <label className="text-xs text-zinc-400">
          Accent
          <input type="color" value={theme.accent} onChange={(e) => onAccent(e.target.value)} className="mt-1 w-full h-8 rounded" />
        </label>
      </div>
      <button type="button" onClick={onReset} className="mt-3 text-xs text-zinc-400 underline">
        Réinitialiser couleurs
      </button>
      <p className="mt-2 text-[11px] text-zinc-500">
        Sync via nuqs → URL partageable: <code>?theme=&bg=&fg=&accent=</code> + hash privé pour le tree.
      </p>
    </div>
  );
}
