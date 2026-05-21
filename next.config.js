/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheVAL: 60,
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects and rewrites
  async redirects() {
    return [
      {
        source: '/marketplace',
        destination: '/products',
        permanent: false,
      },
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_SITE_NAME: 'Cabangile Marketplace',
    NEXT_PUBLIC_SITE_DESCRIPTION: 'Enterprise SaaS Marketplace Platform',
  },

  // Production bundle analysis
  productionBrowserSourceMaps: false,

  // Compression
  compress: true,

  // Poweredby header
  poweredByHeader: false,

  // Optimized fonts
  optimizeFonts: true,

  // SwcMinify
  swcMinify: true,

  // Experimental features for performance
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
    ],
  },
};

module.exports = nextConfig;
