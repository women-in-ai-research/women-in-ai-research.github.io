import path from 'path';
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // Change from 'standalone' to 'export'
    // Add this if you're deploying to a subdirectory (like username.github.io/repo-name)
    basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
    // Disable image optimization since GitHub Pages doesn't support it
    images: {
        unoptimized: true,
    },
};
export default nextConfig;