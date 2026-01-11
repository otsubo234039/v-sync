// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; 
// ★ 前回作成した ThemeContext をインポート (パスに注意！)
import { ThemeProvider } from "@/context/ThemeContext"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "V-Sync",
  description: "VTuber Management System",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* ★ ThemeProvider で全体を囲む (これで色が全画面に適用されます) */}
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}