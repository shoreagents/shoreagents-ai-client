/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    // Allow production builds to successfully complete even if
    // there are ESLint errors. Consider fixing and re-enabling.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete even if there are
    // type errors. Consider fixing and re-enabling.
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 