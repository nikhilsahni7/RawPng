/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   optimizeCss: true,
  // },

  /* config options here */
  images: {
    domains: [
      "images.unsplash.com",
      "plus.unsplash.com",
      "unsplash.com",
      "m.media-amazon.com",
      "d3pf9vt7kp1xrg.cloudfront.net",
    ],
    unoptimized: true,
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d3pf9vt7kp1xrg.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
};

module.exports = nextConfig;
