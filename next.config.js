/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/shared-quiz',
        has: [{ type: 'query', key: 'num', value: '(?<id>.*)' }],
        destination: '/quiz/:id',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
