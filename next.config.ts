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
};

export default nextConfig;
