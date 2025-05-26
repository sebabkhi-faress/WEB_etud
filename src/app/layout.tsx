import type { Metadata, Viewport } from "next"
import "./globals.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import { Toaster } from "react-hot-toast"
import SidebarLayout from "@/components/layout/SidebarLayout"
import { ThemeProvider } from "@/context/ThemeContext"
import localFont from "next/font/local"

const redditMono = localFont({
  src: "../assets/fonts/RedditMono.ttf",
  display: "swap",
})

export const metadata: Metadata = {
  title: "WebEtu - Student Portal",
  description:
    "WebEtu is a student portal designed for students to view their profiles, notes, and academic resources..",
  keywords:
    "student portal, view profiles, student notes, education, WebEtu, academic resources, progres, badji mokhtar, university",
  authors: [{ name: "OSCA", url: process.env.CURRENT_HOST || "http://localhost:3000" }],
  metadataBase: new URL(process.env.CURRENT_HOST || "http://localhost:3000"),
  openGraph: {
    title: "WebEtu - Student Portal",
    description:
      "WebEtu provides students with easy access to their profiles, notes, and important academic resources..",
    url: process.env.CURRENT_HOST || "http://localhost:3000",
    siteName: "WebEtu",
    images: [
      {
        url: `${process.env.CURRENT_HOST || "http://localhost:3000"}/images/banner.png`,
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${redditMono.className} antialiased`}>
        <ThemeProvider>
          <SidebarLayout>
            {children}
          </SidebarLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
