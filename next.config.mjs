/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "atlasimg.blob.core.windows.net",
      },
    ],
  },
  experimental: {
    serverMinification: false,
  },
};

export default nextConfig;
