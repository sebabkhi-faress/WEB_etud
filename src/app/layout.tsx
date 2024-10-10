import type { Metadata, Viewport } from "next"
import "./globals.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import { Toaster } from "react-hot-toast"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "WebEtu - Student Portal",
  description:
    "WebEtu is a student portal designed for students to view their profiles, notes, and academic resources..",
  keywords:
    "student portal, view profiles, student notes, education, WebEtu, academic resources, progres, badji mokhtar, university",
  authors: [{ name: "OSCA", url: process.env.CURRENT_HOST }],
  metadataBase: new URL(process.env.CURRENT_HOST as string),
  openGraph: {
    title: "WebEtu - Student Portal",
    description:
      "WebEtu provides students with easy access to their profiles, notes, and important academic resources..",
    url: process.env.CURRENT_HOST,
    siteName: "WebEtu",
    images: [
      {
        url: "/images/logo-black.png",
        alt: "WebEtu Logo",
        width: 800,
        height: 600,
      },
    ],
    type: "website",
  },
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/images/logo-black.png",
        href: "/images/logo-black.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/images/logo-white.png",
        href: "/images/logo-white.png",
      },
    ],
  },
}

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
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
