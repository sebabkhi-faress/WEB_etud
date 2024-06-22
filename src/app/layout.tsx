import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "WebEtu",
  description: "Made By OSCA",
  icons: {
    icon: "/favicon.ico"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">  
      <body className="flex flex-col bg-gray-100 min-h-screen">
        <Navbar />
        <main className="flex items-center justify-center flex-1 px-4">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
