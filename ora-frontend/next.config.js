/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.shopify.com", "s0.2mdn.net"],
    formats: ["image/avif", "image/webp"],
  },
  env: {
    BASE_URL: 'http://localhost:3003/api',
  },
};

module.exports = nextConfig;
