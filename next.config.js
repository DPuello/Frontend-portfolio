/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable turbo since it's not compatible with Module Federation
  experimental: {
    turbo: false,
  }
};

module.exports = nextConfig;