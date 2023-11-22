/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  api: {
    responseLimit: '15mb',
  },
  publicRuntimeConfig: {
    API_ROOT_URL: process.env.API_ROOT_URL,
  },
};

module.exports = nextConfig;
