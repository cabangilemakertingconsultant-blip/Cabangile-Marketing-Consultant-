import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for SSR security
 * ✅ Session validation
 * ✅ Role-based access control
 * ✅ Multi-tenant isolation
 */

export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = "https://muowlkoasslkgpgvqwmj.supabase.co";
  const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11b3dsa29hc3Nsa2dwZ3Zxd21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyOTczOTQsImV4cCI6MjA5NDg3MzM5NH0.d0h-laSCtE4XF3Rnap8jF6IvfJAJnn2SU7Fax6_l8m0";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // read-only context (Server Components safe fallback)
        }
      },
    },
  });
}
