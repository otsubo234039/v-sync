// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "V-Sync",
  description: "VTuber Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* ★AuthProviderで囲む */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}