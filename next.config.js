// next.config.js

module.exports = {
    async headers() {
        return [
            {
                source: '/api/crux/route', // Adjust this path based on your existing API route
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*', // or specify specific origins
                    },
                    // Add other headers as needed
                ],
            },
            {
                source: '/api/ls', // Add the new API route here
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
