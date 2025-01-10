/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "taggedimg.blob.core.windows.net",
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
