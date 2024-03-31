/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "atlasimg.blob.core.windows.net",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
