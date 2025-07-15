/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure Next.js respects the React app routing
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/:path*',
        destination: '/:path*',
      }
    ];
  },
};

module.exports = nextConfig; 