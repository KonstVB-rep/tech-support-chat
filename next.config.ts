import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  partialPrefetching: true,
  typedRoutes: true,          
  output: "standalone",
  
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "date-fns",
    ],
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.*.*",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "10.*.*.*",
        pathname: "/uploads/**",
      },
    ],
  },
  
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/uploads/:path*",
      },
    ];
  },
  
  turbopack: {},
  
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /node_modules|public\/sw\.js|public\/workbox-.*\.js|public\/manifest\.json/,
      };
    }
    return config;
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default withPWA(nextConfig);