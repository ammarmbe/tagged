/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.ACCOUNT_NAME}.blob.core.windows.net`,
      },
    ],
  },
  experimental: {
    serverMinification: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
