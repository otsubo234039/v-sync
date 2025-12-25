// src/components/staff/StaffSidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StaffSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  // クラス名を動的に生成（スタッフ用：エメラルドグリーン）
  const getLinkClass = (path: string) => 
    `text-2xl transition-all duration-200 flex items-center justify-center w-10 h-10 rounded 
    /* ホバー時の背景色: ライトなら薄いグレー、ダークなら薄い深緑 */
    hover:bg-slate-100 dark:hover:bg-slate-800/50 
    ${
      isActive(path) 
        /* アクティブ時: ライトなら濃いエメラルド、ダークなら蛍光エメラルド+発光 */
        ? "text-emerald-600 dark:text-emerald-400 scale-110 dark:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
        /* 非アクティブ時: ライトならグレー、ダークなら少し暗いグレー */
        : "text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-300 hover:scale-105"
    }`;

  return (
    // サイドバー全体の背景と境界線（エメラルド色）
    <aside className="w-16 flex flex-col items-center py-8 border-r transition-colors duration-300
      bg-white/90 border-slate-200 
      dark:bg-[#020907]/90 dark:border-emerald-500/20 
      backdrop-blur-sm z-20">
      
      {/* ロゴ部分 */}
      <div className="w-10 h-10 rounded-full mb-8 flex items-center justify-center font-bold text-xs transition-colors duration-300
        bg-emerald-600 text-white shadow-md
        dark:bg-emerald-500 dark:text-black dark:shadow-[0_0_15px_#10b981]">
        S
      </div>

      <nav className="flex flex-col gap-6">
        
        <Link href="/staff/dashboard" className={getLinkClass("/staff/dashboard")}>
          📊
        </Link>

        <Link href="/staff/schedule" className={getLinkClass("/staff/schedule")}>
          📅
        </Link>

        <Link href="/staff/tasks" className={getLinkClass("/staff/tasks")}>
          ☑️
        </Link>

        <Link href="/staff/projects" className={getLinkClass("/staff/projects")}>
          📁
        </Link>

        <Link href="/staff/settings" className={getLinkClass("/staff/settings")}>
          ⚙️
        </Link>

      </nav>
    </aside>
  );
}
