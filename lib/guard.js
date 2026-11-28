// Best-effort abuse guard for API routes. Serverless instances do not share memory, so this slows scraping and floods but is not a hard limit.
const buckets = new Map();

// Only Netlify's own header is trusted. A client-supplied X-Forwarded-For is never used, so it cannot be spoofed to dodge the limit.
export function clientIp(request) {
  if (process.env.NETLIFY === "true") return request.headers.get("x-nf-client-connection-ip") || "unknown";
  return "unknown";
}

// Rejects browser requests that come from another website.
export function crossOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try { return new URL(origin).host !== request.headers.get("host"); } catch (e) { return true; }
}

// Returns true when the caller has used up its allowance for this window.
// Callers without a trusted IP share one bucket, so that bucket gets a larger allowance.
export function rateLimited(request, name, limit, windowMs = 60_000) {
  const now = Date.now();
  const ip = clientIp(request);
  const key = `${name}:${ip}`;
  if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
  if (buckets.size > 20000) buckets.clear();
  let b = buckets.get(key);
  if (!b || b.reset < now) { b = { count: 0, reset: now + windowMs }; buckets.set(key, b); }
  b.count += 1;
  return b.count > (ip === "unknown" ? limit * 10 : limit);
}

// Reads a small JSON body. Returns { data } or { error, status }.
export async function readJson(request, maxBytes = 20_000) {
  if (!(request.headers.get("content-type") || "").toLowerCase().startsWith("application/json")) return { error: "Unsupported media type.", status: 415 };
  if (Number(request.headers.get("content-length") || 0) > maxBytes) return { error: "Request too large.", status: 413 };
  const text = await request.text().catch(() => null);
  if (text === null || text.length > maxBytes) return { error: "Request too large.", status: 413 };
  try {
    const data = JSON.parse(text);
    if (data === null || typeof data !== "object" || Array.isArray(data)) return { error: "Bad request.", status: 400 };
    return { data };
  } catch (e) {
    return { error: "Bad request.", status: 400 };
  }
}

export const tooMany = () => new Response(JSON.stringify({ error: "Too many requests. Please slow down." }), { status: 429, headers: { "Content-Type": "application/json", "Retry-After": "60" } });
export const forbidden = () => new Response(JSON.stringify({ error: "Forbidden." }), { status: 403, headers: { "Content-Type": "application/json" } });
