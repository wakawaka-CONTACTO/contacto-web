/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.cloudfront.net',
        },
        {
          protocol: 'https',
          hostname: 'd1l4m6pzgl3p9g.cloudfront.net',
          pathname: '/portfolio/**',
        },
        {
          protocol: 'http',
          hostname: '**',
        },

        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
  }
  
module.exports = nextConfig