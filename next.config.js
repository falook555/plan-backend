/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
   //สำหรับ static
    output: 'export',
    distDir: 'dist',
    basePath: '/plan',
   //สำหรับ static
}

module.exports = nextConfig
