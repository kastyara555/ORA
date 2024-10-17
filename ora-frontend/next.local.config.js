/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["cdn.shopify.com", "s0.2mdn.net"],
    formats: ["image/avif", "image/webp"],
  },
  env: {
    BASE_URL_BACK: 'http://127.0.0.1:3003',
    BASE_URL_FRONT: 'http://127.0.0.1:3000',
  },
};

module.exports = nextConfig;
