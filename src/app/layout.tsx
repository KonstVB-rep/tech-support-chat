import { PwaInstallBanner } from "@/features/pwa-install";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// import { MainHeader } from "@/widgets/main-header";
import RootProvider from "./providers/root-provider";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};


export const metadata: Metadata = {
  title: "Чат техподдержки",
  description: "Онлайн-помощь в реальном времени",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ЧатПоддержки",
  },
};


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RootProvider>
           {/* <MainHeader /> */}
           <div className="flex w-full">
            {children}
            </div>
            <PwaInstallBanner />
        </RootProvider>
      </body>

    </html>
  );
}
