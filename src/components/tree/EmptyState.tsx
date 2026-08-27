import { compressToB64 } from "@lib/compress";

type Props = {
  onLoaded: (raw: string) => void;
};

export function EmptyState({ onLoaded }: Props) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full border rounded-2xl p-8 bg-zinc-900 text-zinc-100">
        <h1 className="text-2xl font-semibold">tree - visualiseur</h1>
        <p className="mt-2 text-zinc-400 text-sm">Aucun tree dans l&apos;URL. Lance depuis ton dossier:</p>
        <pre className="mt-4 bg-black/50 rounded-xl p-4 text-sm overflow-x-auto">curl -s https://app.nikho.dev/sh/tree.sh | bash</pre>
        <p className="mt-3 text-xs text-zinc-500">
          Par défaut rien n&apos;est envoyé au serveur - les données restent dans le <code>#hash</code> de l&apos;URL (jamais loggé). Lien court 24h disponible en opt-in. Thème sauvé via <code>?theme=</code> (nuqs).
        </p>
        <div className="mt-6">
          <p className="text-xs text-zinc-400">Coller un tree ascii manuellement:</p>
          <textarea
            className="mt-1 w-full h-32 rounded-xl bg-zinc-950 border border-zinc-800 p-3 text-sm font-mono"
            placeholder={".\n├── src/\n│   └── index.ts"}
            onChange={async (e) => {
              const v = e.target.value.trim();
              if (!v) return;
              const b64 = await compressToB64(v);
              location.hash = b64;
              onLoaded(v);
            }}
          />
        </div>
      </div>
    </div>
  );
}
