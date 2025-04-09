/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  productionBrowserSourceMaps: false,
  webpack: (config) => {
    config.cache = false
    config.performance = {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
    return config
  },
  experimental: {
    disablePostcssPresetEnv: true
  }
}

module.exports = nextConfig
