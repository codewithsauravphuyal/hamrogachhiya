/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Add this experimental configuration for path aliases
  experimental: {
    esmExternals: 'loose',
  },
}

module.exports = nextConfig