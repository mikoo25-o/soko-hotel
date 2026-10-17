/**
 * Environment access. Nothing here throws at import time, so the marketing
 * page still renders when Supabase has not been configured yet. Pages that
 * need the backend check isSupabaseConfigured() and show a clear setup
 * notice instead of pretending to work.
 */

export function supabaseUrl(): string | undefined {
  const v = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return v && /^https?:\/\//.test(v) && !v.includes("YOUR-PROJECT-REF") ? v : undefined;
}

export function supabaseAnonKey(): string | undefined {
  const v = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return v && !v.startsWith("YOUR-") ? v : undefined;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl() && supabaseAnonKey());
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function trialDays(): number {
  const n = Number(process.env.TRIAL_DAYS);
  return Number.isInteger(n) && n >= 0 && n <= 90 ? n : 14;
}

/** The service-role key is server-only. Returns undefined when not set. */
export function serviceRoleKey(): string | undefined {
  const v = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return v && !v.startsWith("YOUR-") ? v : undefined;
}

export function mpesaConfigured(): boolean {
  const e = process.env;
  return Boolean(
    e.MPESA_CONSUMER_KEY && e.MPESA_CONSUMER_SECRET && e.MPESA_SHORTCODE && e.MPESA_PASSKEY && e.MPESA_CALLBACK_URL,
  );
}
