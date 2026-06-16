import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: false, // Выключаем в dev-режиме, чтобы кэш не мешал разработке
  register: true,                                  // Автоматически регистрировать Service Worker
  skipWaiting: true,                               // Быстрое обновление приложения при выходе новой версии
});

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',        
      },
    ],
  },
    webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        // Одно чистое регулярное выражение вместо массива регулярных выражений:
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
