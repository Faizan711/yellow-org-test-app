/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["cdn.jsdelivr.net"],
        unoptimized: true,
    },
};

module.exports = nextConfig;
