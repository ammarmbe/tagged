/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "taggedimg.blob.core.windows.net",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
