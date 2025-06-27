/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [new URL('https://img.youtube.com/**')],
    },
}

module.exports = nextConfig

