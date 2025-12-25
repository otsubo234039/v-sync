// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; 
import { ThemeProvider } from "@/providers/ThemeProvider"; // ★追加

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
    // ★suppressHydrationWarningを追加 (next-themes使用時は必須)
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {/* ★ThemeProviderで囲む (属性をclassモードに設定) */}
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}