/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.NODE_ENV === 'development' && process.env.STUDIO_DIST_DIR === '.next-studio' ? '.next-studio' : '.next',
};

module.exports = nextConfig;

