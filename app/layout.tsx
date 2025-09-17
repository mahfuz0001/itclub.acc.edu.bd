import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/firebase/auth-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ACC IT Club | Official Website",
  description:
    "Adamjee Cantonment College IT Club inspires students to learn, innovate, and explore technology. Join us for events, competitions, and coding sessions.",
  keywords: [
    "ACC IT Club",
    "Adamjee Cantonment College",
    "IT Club Bangladesh",
    "coding club",
    "tech events",
    "programming club",
    "student innovation",
  ],
  openGraph: {
    title: "ACC IT Club | Official Website",
    description:
      "Join Adamjee Cantonment College IT Club – a community where students learn, code, and innovate together.",
    url: "https://itclub.acc.edu.bd",
    siteName: "ACC IT Club",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ACC IT Club",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ACC IT Club",
    description:
      "The official IT club of Adamjee Cantonment College. Inspiring students to learn and innovate.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://itclub.acc.edu.bd",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
