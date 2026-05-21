import { createServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for SSR security
 * ✅ Session validation
 * ✅ Role-based access control
 * ✅ Protected API operations
 * ✅ Multi-tenant isolation
 */

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
            // Handle cookie setting errors (read-only contexts)
          }
        },
      },
    }
  );
}

/**
 * Get authenticated user with role validation
 * Returns: { user, role, tenant_id } or throws
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  // Fetch user profile with role & tenant info
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("id, email, role, tenant_id, verified_at, metadata")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("Profile not found");
  }

  return {
    user,
    profile,
    role: profile.role,
    tenantId: profile.tenant_id,
    verified: !!profile.verified_at,
  };
}

/**
 * Check if user has specific role
 */
export async function checkRole(
  requiredRole: "admin" | "seller" | "buyer" | string[]
) {
  try {
    const { role } = await getAuthenticatedUser();

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(role)) {
      throw new Error(`Insufficient permissions. Required: ${requiredRole}`);
    }

    return true;
  } catch (error) {
    throw error;
  }
}

/**
 * Verify tenant ownership (multi-tenant isolation)
 */
export async function verifyTenantAccess(tenantId: string) {
  const { tenantId: userTenantId } = await getAuthenticatedUser();

  if (userTenantId !== tenantId) {
    throw new Error("Tenant access denied");
  }

  return true;
}

/**
 * Get tenant data (seller's store info)
 */
export async function getTenantData(tenantId: string) {
  await verifyTenantAccess(tenantId);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tenants")
    .select(
      `
      id, 
      name, 
      slug, 
      description, 
      logo_url,
      stripe_account_id,
      whatsapp_number,
      created_at,
      metadata
    `
    )
    .eq("id", tenantId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get current user's tenant (seller dashboard)
 */
export async function getUserTenant() {
  const { tenantId } = await getAuthenticatedUser();

  return getTenantData(tenantId);
}
