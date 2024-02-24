/** @type {import('next').NextConfig} */
const nextConfig = {};

// next.config.js

module.exports = {
    async headers() {
        return [
            {
                source: '/api/cls', // Adjust this path based on your API route
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*', // or specify specific origins
                    },
                    // Add other headers as needed
                ],
            },
        ];
    },
};