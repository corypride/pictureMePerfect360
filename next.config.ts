import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      }
    ],
    // For static export, we need to use unoptimized images
    unoptimized: process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('live'),
  },
  experimental: {
    allowedDevOrigins: ["https://*.cloudworkstations.dev"],
  },
  // Static export configuration for Render
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  // Generate sitemap for static hosting
  generateBuildId: async () => {
    return 'build'
  },
};

export default nextConfig;
