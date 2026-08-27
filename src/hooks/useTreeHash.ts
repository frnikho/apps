import { useEffect, useState, useSyncExternalStore } from "react";
import { decompressFromB64 } from "@lib/compress";

function subscribe(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

function getHashSnapshot() {
  return location.hash.slice(1);
}

function getServerSnapshot() {
  return "";
}

export function useTreeHash() {
  const hash = useSyncExternalStore(subscribe, getHashSnapshot, getServerSnapshot);
  const [state, setState] = useState<{ raw: string | null; err: string | null; loading: boolean }>({
    raw: null,
    err: null,
    loading: Boolean(hash),
  });

  useEffect(() => {
    let cancelled = false;
    if (!hash) {
      setState({ raw: null, err: null, loading: false });
      return;
    }
    setState((s) => ({ ...s, loading: true }));
    decompressFromB64(hash.trim()).then((decoded) => {
      if (cancelled) return;
      if (decoded === null) {
        setState({ raw: null, err: "Lien invalide ou corrompu. Régénère avec: curl -s https://app.nikho.dev/sh/tree.sh | bash", loading: false });
      } else {
        setState({ raw: decoded, err: null, loading: false });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [hash]);

  return { ...state, hash };
}
