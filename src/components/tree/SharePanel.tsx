type Props = {
  raw: string | null;
  shortUrl: string | null;
  shortLoading: boolean;
  shortErr: string | null;
  onCopyTree: () => void;
  onCopyUrl: () => void;
  onCreateShort: () => void;
};

export function SharePanel({ raw: _raw, shortUrl, shortLoading, shortErr, onCopyTree, onCopyUrl, onCreateShort }: Props) {
  return (
    <div className="rounded-2xl border bg-zinc-900 border-zinc-800 p-4">
      <h3 className="text-sm font-semibold text-zinc-100">Partage</h3>
      <p className="mt-1 text-xs text-zinc-400">Par défaut, rien n&apos;est stocké. Le lien long est 100% local.</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={onCopyTree} className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm py-2 border border-zinc-700">
          Copy tree
        </button>
        <button type="button" onClick={onCopyUrl} className="flex-1 rounded-xl bg-white text-black text-sm py-2 font-medium">
          Copy URL
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
        <div className="text-xs font-medium text-amber-300">Besoin d&apos;un lien court ?</div>
        <div className="text-xs text-amber-200/70 mt-1">Opt-in: stocké 24h puis supprimé. Non loggé, non indexé.</div>
        <button type="button" onClick={onCreateShort} disabled={shortLoading} className="mt-3 w-full rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm py-2 font-medium disabled:opacity-50">
          {shortLoading ? "Génération…" : "Générer lien court (6 chars)"}
        </button>
        {shortUrl && (
          <div className="mt-3">
            <div className="text-xs text-zinc-300 break-all">
              <a href={shortUrl} className="underline">
                {shortUrl}
              </a>{" "}
              — copié !
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">Expire dans 24h. Suppression auto. Aucune donnée perso collectée.</div>
          </div>
        )}
        {shortErr && <div className="mt-2 text-xs text-red-400">{shortErr}</div>}
      </div>
    </div>
  );
}
