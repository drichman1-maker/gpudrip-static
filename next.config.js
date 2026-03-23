/** type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'dist',
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
