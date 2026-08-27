function b64UrlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64UrlDecode(b64: string): Uint8Array<ArrayBuffer> {
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const std = b64.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(std);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function compressToB64(input: string): Promise<string> {
  const cs = new CompressionStream("deflate");
  const writer = cs.writable.getWriter();
  writer.write(new TextEncoder().encode(input));
  writer.close();
  const ab = await new Response(cs.readable).arrayBuffer();
  return b64UrlEncode(new Uint8Array(ab));
}

export async function decompressFromB64(b64: string): Promise<string | null> {
  if (!b64) return null;
  try {
    const bytes = b64UrlDecode(b64.trim());
    const ds = new DecompressionStream("deflate");
    const writer = ds.writable.getWriter();
    writer.write(bytes as unknown as Uint8Array<ArrayBuffer>);
    writer.close();
    return await new Response(ds.readable).text();
  } catch {
    return null;
  }
}
