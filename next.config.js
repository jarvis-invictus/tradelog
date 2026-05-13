/** @type {import('next').NextConfig} */

// next-pwa (v5) is not compatible with Next.js 16 Turbopack.
// PWA will be configured in M0.5 using @ducanh2912/next-pwa (Turbopack-compatible fork).
// next-pwa is kept in package.json for reference and will be replaced then.

const nextConfig = {
  reactStrictMode: true,
  // Removed turbopack: {} for Vercel compatibility
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
}

module.exports = nextConfig
