import path from 'path';
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // This ensures Next.js builds static HTML files
    // Add this if you're deploying to a GitHub organization site
    // No need for basePath since you're using the organization.github.io format
    images: {
        unoptimized: true, // Required for static export
    },
    // Disable trailing slashes
    trailingSlash: false,
};

export default nextConfig;