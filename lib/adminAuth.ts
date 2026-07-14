// Signed admin session tokens. Edge- and Node-compatible (Web Crypto only),
// so this can be imported from middleware, server actions, and route handlers.
//
// A token is `<expiry-ms>.<base64url-HMAC-SHA256(expiry-ms)>`. Without the
// secret the signature cannot be forged, so a static cookie value no longer
// grants admin access.

const SECRET =
  process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSCODE || "";

const DEFAULT_TTL_MS = 60 * 60 * 24 * 7; // 7 days, in seconds
const TTL_MS = DEFAULT_TTL_MS * 1000;

function bytes(input: string): Uint8Array {
  return new TextEncoder().encode(input);
}

function toBase64Url(buffer: ArrayBuffer): string {
  const view = new Uint8Array(buffer);
  let binary = "";
  for (const byte of view) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    bytes(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, bytes(data));
  return toBase64Url(signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** How long a session lasts, in seconds (for the cookie maxAge). */
export const SESSION_MAX_AGE = DEFAULT_TTL_MS;

/** Create a signed session token that expires in 7 days. */
export async function createSessionToken(): Promise<string> {
  const exp = String(Date.now() + TTL_MS);
  const signature = await sign(exp);
  return `${exp}.${signature}`;
}

/** True only for an unexpired token whose signature matches our secret. */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token || !SECRET) return false;
  const dot = token.indexOf(".");
  if (dot < 1) return false;
  const expPart = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const exp = Number(expPart);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = await sign(expPart);
  return timingSafeEqual(signature, expected);
}
