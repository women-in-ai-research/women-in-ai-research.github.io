// Determine if we're in production or local testing mode
const isProd = process.env.NODE_ENV === 'production';
const isLocalTesting = process.env.LOCAL_TESTING === 'true';

// Only apply the base path and asset prefix in production, not for local testing
const basePath = isProd && !isLocalTesting ? '/women-in-ai-research' : '';
const assetPrefix = isProd && !isLocalTesting ? '/women-in-ai-research' : '';

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: assetPrefix,
  basePath: basePath,
  output: 'export'
};

export default nextConfig;
