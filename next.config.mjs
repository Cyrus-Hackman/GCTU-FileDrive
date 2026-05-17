/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "hallowed-shepherd-830.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
