/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['bcrypt-ts'],
}

module.exports = nextConfig 