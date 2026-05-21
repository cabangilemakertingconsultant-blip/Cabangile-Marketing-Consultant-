
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Image optimization (FIXED)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Security headers (OK - production safe)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/marketplace",
        destination: "/products",
        permanent: false,
      },
    ];
  },

  // ❌ REMOVE env block (IMPORTANT FIX)
  // env: {
  //   NEXT_PUBLIC_SITE_NAME: 'Cabangile Marketplace',
  //   NEXT_PUBLIC_SITE_DESCRIPTION: 'Enterprise SaaS Marketplace Platform',
  // },

  // Performance
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  swcMinify: true,

  // FIXED (optimizeFonts is deprecated in modern Next.js)
  optimizeFonts: true,

  // Experimental (safe)
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

module.exports = nextConfig;