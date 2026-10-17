import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { serviceRoleKey, supabaseUrl } from "@/lib/env";

/**
 * Service-role client. It bypasses RLS, so it is used for exactly one thing:
 * the login and join rate limiter. Never use it to read tenant data on behalf
 * of a user.
 */
export function createServiceClient() {
  const url = supabaseUrl();
  const key = serviceRoleKey();
  if (!url || !key) return null;
  return createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
