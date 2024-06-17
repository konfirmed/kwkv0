/** @type {import('next').NextConfig} */
const nextConfig = {};

// next.config.js

module.exports = {
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals = ['puppeteer', ...config.externals];
      }
  
      return config;
    },
  };
  