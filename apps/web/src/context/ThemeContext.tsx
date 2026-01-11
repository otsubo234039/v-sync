"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = 'dark' | 'light';

type ThemeContextType = {
  accentColor: string;
  setAccentColor: (color: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  backgroundStyle: React.CSSProperties;
  baseTextColor: string;
};

const ThemeContext = createContext<ThemeContextType>({
  accentColor: "#10b981",
  setAccentColor: () => {},
  themeMode: 'dark',
  setThemeMode: () => {},
  backgroundStyle: {},
  baseTextColor: "text-slate-200",
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [accentColor, setAccentColor] = useState("#10b981");
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    const savedColor = localStorage.getItem("app-accent-color");
    const savedMode = localStorage.getItem("app-theme-mode") as ThemeMode;
    if (savedColor) setAccentColor(savedColor);
    if (savedMode) setThemeMode(savedMode);
  }, []);

  useEffect(() => {
    // RGB変数を計算してCSS変数にセット
    const hex = accentColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const root = document.documentElement;
    root.style.setProperty("--brand-color", accentColor);
    root.style.setProperty("--brand-rgb", `${r} ${g} ${b}`);

    localStorage.setItem("app-accent-color", accentColor);
    localStorage.setItem("app-theme-mode", themeMode);
  }, [accentColor, themeMode]);

  // ★ 背景スタイルの自動生成
  const backgroundStyle: React.CSSProperties = {
    backgroundColor: themeMode === 'dark' ? '#000000' : '#ffffff',
    backgroundImage: themeMode === 'dark'
      // 黒モード: スタイリッシュな薄い光 (0.25)
      ? `
        radial-gradient(ellipse at top, rgb(var(--brand-rgb) / 0.25), transparent 70%), 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), 
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
      `
      // ★ 白モード: 色多め！光を強く(0.4)して、画面全体を推し色で包む
      : `
        radial-gradient(ellipse at top, rgb(var(--brand-rgb) / 0.4), transparent 80%), 
        linear-gradient(rgba(0, 0, 0, 0.04) 1px, transparent 1px), 
        linear-gradient(90deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
      `,
    backgroundSize: '100% 100%, 40px 40px, 40px 40px'
  };

  const baseTextColor = themeMode === 'dark' ? "text-slate-200" : "text-slate-800";

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor, themeMode, setThemeMode, backgroundStyle, baseTextColor }}>
      {children}
    </ThemeContext.Provider>
  );
}