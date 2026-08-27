import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQueryState } from "nuqs";
import { hexParser, themeParser } from "@lib/parsers";
import { useTreeHash } from "@hooks/useTreeHash";
import { THEMES } from "@lib/theme";
import { saveTreeShare } from "@lib/treeShare";
import { EmptyState } from "@components/tree/EmptyState";
import { SharePanel } from "@components/tree/SharePanel";
import { ThemePanel } from "@components/tree/ThemePanel";
import { TreePreview } from "@components/tree/TreePreview";

export const Route = createFileRoute("/tree/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { raw, err, hash } = useTreeHash();
  const [localRaw, setLocalRaw] = useState<string | null>(null);
  const displayRaw = raw ?? localRaw;
  const displayErr = err;

  const [themeKey, setThemeKey] = useQueryState("theme", themeParser);
  const [customBg, setCustomBg] = useQueryState("bg", hexParser);
  const [customFg, setCustomFg] = useQueryState("fg", hexParser);
  const [customAccent, setCustomAccent] = useQueryState("accent", hexParser);

  const [copied, setCopied] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [shortLoading, setShortLoading] = useState(false);
  const [shortErr, setShortErr] = useState<string | null>(null);

  const theme = useMemo(() => {
    const base = THEMES[themeKey] ?? THEMES.dark;
    return {
      ...base,
      bg: customBg ?? base.bg,
      fg: customFg ?? base.fg,
      accent: customAccent ?? base.accent,
    };
  }, [themeKey, customBg, customFg, customAccent]);

  async function onCopy() {
    if (!displayRaw) return;
    await navigator.clipboard.writeText(displayRaw);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function createShortLink() {
    if (!displayRaw) return;
    setShortLoading(true);
    setShortErr(null);
    try {
      const data = await saveTreeShare({ data: { content: displayRaw } });
      const full = `${location.origin}${data.url}`;
      setShortUrl(full);
      await navigator.clipboard.writeText(full).catch(() => {});
    } catch (e) {
      setShortErr(e instanceof Error ? e.message : "Échec création lien");
    } finally {
      setShortLoading(false);
    }
  }

  const tooLong = hash.length > 1800;

  if (!displayRaw && !displayErr) {
    return <EmptyState onLoaded={setLocalRaw} />;
  }

  if (displayErr) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border bg-zinc-900 border-zinc-800 p-6 text-center">
          <div className="text-sm text-red-400">{displayErr}</div>
          <div className="text-xs text-zinc-500 mt-2">Vérifie le lien ou régénère via le script.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <div className="flex flex-wrap gap-2 mb-3 items-center">
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">🔒 hash privé — 0 stockage serveur</span>
            {tooLong && <span className="text-xs px-2 py-1 rounded-full bg-amber-500/15 text-amber-300">URL longue — pense au lien court</span>}
          </div>

          {/* biome-ignore lint/style/noNonNullAssertion: early return garantit non-null */}
          <TreePreview raw={displayRaw!} theme={theme} onCopy={onCopy} copied={copied} />

          <p className="mt-3 text-xs text-zinc-500">
            Tip: <code>curl -s https://app.nikho.dev/sh/tree.sh | bash -- --open</code> pour ouvrir direct. Le hash <code>#...</code> n&apos;est jamais envoyé au serveur. Thème dans l&apos;URL via nuqs: <code>?theme=dark&bg=...</code>
          </p>
        </div>

        <div className="space-y-4">
          <ThemePanel theme={theme} themeKey={themeKey} onThemeKey={(k: keyof typeof THEMES) => void setThemeKey(k)} onBg={(v) => void setCustomBg(v)} onFg={(v) => void setCustomFg(v)} onAccent={(v) => void setCustomAccent(v)} onReset={() => { void setCustomBg(null); void setCustomFg(null); void setCustomAccent(null); }} />
          <SharePanel raw={displayRaw} shortUrl={shortUrl} shortLoading={shortLoading} shortErr={shortErr} onCopyTree={onCopy} onCopyUrl={() => navigator.clipboard.writeText(location.href)} onCreateShort={createShortLink} />
          <div className="rounded-2xl border bg-zinc-950 border-zinc-800 p-4">
            <h4 className="text-xs font-semibold text-zinc-300">Éthique données</h4>
            <ul className="mt-2 text-xs text-zinc-500 list-disc pl-4 space-y-1">
              <li>Hash = jamais envoyé au serveur, jamais loggé.</li>
              <li>Lien court = stockage temporaire 24h, pas de tracking.</li>
              <li>Compression native (Bun/CompressionStream) — 0 dépendance lourde.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
