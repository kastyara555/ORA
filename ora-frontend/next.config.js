/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["cdn.shopify.com", "s0.2mdn.net"],
    formats: ["image/avif", "image/webp"],
  },
  env: {
    BASE_URL: 'http://orabeauty.by',
    // BASE_URL: 'http://127.0.0.1:3003',
  },
};

module.exports = nextConfig;
