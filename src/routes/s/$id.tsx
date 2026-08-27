import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { compressToB64 } from "@lib/compress";
import { getTreeShare } from "@lib/treeShare";

export const Route = createFileRoute("/s/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const [data, setData] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const found = await getTreeShare({ data: { id } });
        if (cancelled) return;
        setData(found.content);
        try {
          const b64 = await compressToB64(found.content);
          history.replaceState(null, "", `/tree#${b64}`);
        } catch {}
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Erreur");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (err) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border bg-zinc-900 border-zinc-800 p-6 text-center">
          <div className="text-sm text-red-400">Lien expiré ou invalide.</div>
          <div className="text-xs text-zinc-500 mt-2 break-all">{err}</div>
          <Link to="/tree" className="inline-block mt-4 text-sm underline text-zinc-300">
            Créer un nouveau tree
          </Link>
          <div className="text-[11px] text-zinc-600 mt-3">Les liens courts expirent après 24h et sont supprimés automatiquement.</div>
        </div>
      </div>
    );
  }

  if (data === null) {
    return <div className="p-8 text-center text-zinc-500 text-sm">Chargement…</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-xs text-zinc-500 mb-3">
          Lien court <span className="font-mono text-zinc-300">/s/{id}</span> ·{" "}
          <Link to="/tree" className="underline">
            ouvrir en /tree
          </Link>
        </div>
        <pre className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-[13px] leading-5 whitespace-pre overflow-x-auto text-zinc-100 font-mono">
          {data}
        </pre>
        <div className="mt-3 text-xs text-zinc-500">Ce contenu expire 24h après création. Redirigé vers <code>/tree#…</code> pour copie privée.</div>
      </div>
    </div>
  );
}
