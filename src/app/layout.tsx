import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

import RootProvider from "./providers/root-provider"

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "Чат техподдержки",
  description: "Онлайн-помощь в реальном времени",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ЧатПоддержки",
  },
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      lang="ru"
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <RootProvider>
          <div className="flex w-full pb-[88px] md:pb-0">{children}</div>
          {/* <PwaInstallBanner /> */}
        </RootProvider>
      </body>
    </html>
  )
}
