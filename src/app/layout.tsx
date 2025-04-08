import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProviderClient } from "@/components/ThemeProviderClient";
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
  title: "TripSync - Seyahatinizi keşfedin",
  description: "TripSync ile mükemmel seyahat destinasyonunuzu keşfedin",
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(190, 85%, 45%)' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(220, 25%, 10%)' }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProviderClient>
          {children}
        </ThemeProviderClient>
      </body>
    </html>
  );
}
