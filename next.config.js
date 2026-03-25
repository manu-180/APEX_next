/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow external image domains as needed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google avatars
      },
    ],
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
}

module.exports = nextConfig
