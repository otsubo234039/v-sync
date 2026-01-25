"use client";
import Sidebar from "@/components/admin/Sidebar";
import { useTheme } from "@/context/ThemeContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { themeMode, accentColor } = useTheme();

  return (
    <div className={themeMode === 'dark' ? 'dark' : ''}>
      <div 
        className="flex h-screen w-screen font-sans relative overflow-hidden transition-colors duration-500 bg-slate-50 dark:bg-[#050a0e] text-slate-900 dark:text-slate-200"
      >
        {/* ■ 共通背景（理想図のようなグリッド） ■ */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundImage: `
                linear-gradient(${themeMode === 'dark' ? '#ffffff10' : '#00000008'} 1px, transparent 1px), 
                linear-gradient(90deg, ${themeMode === 'dark' ? '#ffffff10' : '#00000008'} 1px, transparent 1px)
              `, 
              backgroundSize: '40px 40px' 
            }} 
          />
          {/* アクセントカラーのほのかな環境光 */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-20 pointer-events-none"
             style={{ background: `radial-gradient(circle at 50% 50%, ${accentColor}, transparent 70%)` }}
          />
        </div>

        {/* コンテンツエリア */}
        <div className="relative z-10 flex w-full h-full">
          <Sidebar />
          <main className="flex-1 h-full overflow-hidden relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}