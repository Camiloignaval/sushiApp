/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = {
  async rewrites() {
    return [
      {
        source: "/maps/api/:path*",
        destination: "https://maps.googleapis.com/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
