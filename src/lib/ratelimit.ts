/**
 * Kleine Bremse gegen das Durchprobieren von Kurskennwörtern.
 *
 * Seit die Anmeldung ohne Kursnamen auskommt, ist das Kennwort allein der
 * Zugang – entsprechend lohnt sich Raten. Der Zähler liegt im Arbeitsspeicher:
 * auf mehreren Server-Instanzen bremst er dadurch nur anteilig, was für den
 * Zweck reicht. Eine echte Sperre gehörte in die Datenbank und würde jeden
 * Anmeldeversuch einen Schreibvorgang kosten.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Aufräumen, damit die Map nicht unbegrenzt wächst. */
function sweep(now: number): void {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

export function hit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  bucket.count++;
  if (bucket.count > limit) {
    return { ok: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true };
}

/** Nach einer erfolgreichen Anmeldung soll der Zähler nicht nachhängen. */
export function reset(key: string): void {
  buckets.delete(key);
}

/**
 * Absender einer Anfrage, so gut es hinter einem Proxy geht. Vercel setzt
 * `x-forwarded-for`; fehlt der Kopf, landen alle im selben Topf – dann bremst
 * die Sperre grob, aber sie bremst.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unbekannt";
}
