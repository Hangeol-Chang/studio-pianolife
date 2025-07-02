/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            new URL('https://img.youtube.com/**'),
            new URL('https://i.ytimg.com/**')
        ],
    },
}

module.exports = nextConfig