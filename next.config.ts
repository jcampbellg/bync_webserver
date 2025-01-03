import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['knex'],
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
}

export default nextConfig
