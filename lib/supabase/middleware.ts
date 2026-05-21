import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 🔐 Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = request.nextUrl;

  // 🚫 Protected routes (edit these for your SaaS)
  const protectedRoutes = ["/dashboard", "/admin", "/profile"];

  const isProtected = protectedRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  // ❌ If not logged in and trying to access protected route
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ If logged in and trying to access login/signup
  if (session && (url.pathname === "/login" || url.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
      Run middleware on all routes except:
      - api routes
      - static files
      - images
    */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};