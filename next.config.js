/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'fkodama.com'
      },
      {
        protocol: 'https',
        hostname: 'www.fkodama.com'
      },
      {
        protocol: 'http',
        hostname: 'localhost:3000'
      }
    ]
  },
  // Disable source maps in development to avoid Turbopack source map warnings
  // This is a known issue with Turbopack - the error is harmless but annoying
  productionBrowserSourceMaps: false
};

module.exports = nextConfig;
