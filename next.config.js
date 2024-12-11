/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },

  /* config options here */
  images: {
    domains: [
      "images.unsplash.com",
      "plus.unsplash.com",
      "unsplash.com",
      "m.media-amazon.com",
      "d1u0z778tbk6uw.cloudfront.net",
      "d3bxy9euw4e147.cloudfront.net",
    ],
  },
};

module.exports = nextConfig;
