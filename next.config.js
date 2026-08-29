/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Emit <route>/index.html so both /mentorship and /mentorship/ resolve on
  // GitHub Pages (bare .html files 404 on the trailing-slash form).
  trailingSlash: true,
  // basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig 