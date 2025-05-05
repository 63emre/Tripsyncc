import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProviderClient } from "@/components/ThemeProviderClient";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TripSync - Seyahat ve Konaklama Platformu",
  description: "TripSync ile unutulmaz seyahat deneyimleri keşfedin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ThemeProviderClient>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProviderClient>
      </body>
    </html>
  );
}
