import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Barikoi - Your Location Intelligence Partner",
  description: "Barikoi provides cutting-edge location intelligence solutions to help businesses make smarter decisions.",
  keywords: ["Barikoi", "location intelligence", "geospatial data", "mapping", "GIS"],
  openGraph: {
    title: "Barikoi - Your Location Intelligence Partner",
    description: "Barikoi provides cutting-edge location intelligence solutions to help businesses make smarter decisions.",
    url: "https://www.barikoi.com",
    siteName: "Barikoi",
    images: [
      {
        url: "https://www.barikoi.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barikoi - Your Location Intelligence Partner",
    description: "Barikoi provides cutting-edge location intelligence solutions to help businesses make smarter decisions.",
    images: ["https://www.barikoi.com/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
