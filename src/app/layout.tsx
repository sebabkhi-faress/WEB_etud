import type { Metadata } from "next"
import "./globals.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import { Toaster } from "react-hot-toast"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "WebEtu",
  description: "Made By OSCA",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/images/logo-dark.png",
        href: "/images/logo-dark.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/images/logo-white.png",
        href: "/images/logo-white.png",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col bg-gray-100 min-h-screen">
        <Navbar />
        <main className="flex items-center justify-center flex-1 relative">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
