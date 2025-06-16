/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "calmme-img.vercel.app", 
        port: "",
        pathname: "**", 
      },
    ],
  },
};


export default nextConfig;
