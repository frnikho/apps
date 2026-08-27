import { useMemo } from "react";
import type { Theme } from "@lib/theme";

type Props = {
  raw: string;
  theme: Theme;
  onCopy: () => void;
  copied: boolean;
};

export function TreePreview({ raw, theme, onCopy, copied }: Props) {
  const keyedLines = useMemo(() => {
    const seen: Record<string, number> = {};
    const lines = raw.split("\n");
    return lines.map((l) => {
      const n = seen[l] ?? 0;
      seen[l] = n + 1;
      return { l, key: `${l}::${n}` };
    });
  }, [raw]);

  return (
    <div className="rounded-2xl border overflow-hidden shadow-xl" style={{ background: theme.bg, borderColor: `${theme.accent}30` }}>
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: `${theme.accent}20`, background: theme.bg }}>
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="text-xs opacity-60" style={{ color: theme.fg }}>
          tree
        </div>
        <button type="button" onClick={onCopy} className="text-xs px-3 py-1.5 rounded-full border font-medium hover:opacity-90" style={{ background: theme.accent, color: "#fff", borderColor: theme.accent }}>
          {copied ? "✓ Copié" : "Copy"}
        </button>
      </div>

      <pre
        className="p-5 md:p-6 text-[13px] leading-5 overflow-x-auto whitespace-pre"
        style={{
          color: theme.fg,
          background: theme.bg,
          borderRadius: `0 0 ${theme.radius}px ${theme.radius}px`,
          fontFamily: theme.font === "mono" ? "ui-monospace, SFMono-Regular, Menlo, monospace" : "ui-sans-serif, system-ui",
        }}
      >
        {keyedLines.map(({ l, key }, idx) => (
          <div key={key} style={{ display: "flex" }}>
            {theme.showLineNumbers && (
              <span className="select-none opacity-30 mr-4 text-right" style={{ minWidth: "2ch" }}>
                {idx + 1}
              </span>
            )}
            <span>{l || " "}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}
