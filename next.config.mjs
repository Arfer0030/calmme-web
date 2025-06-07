/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tambahkan blok 'images' ini
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "calmme-img.vercel.app", // Ganti dengan hostname Anda
        port: "",
        pathname: "**", // Izinkan semua path dari hostname ini
      },
    ],
  },
};


export default nextConfig;
