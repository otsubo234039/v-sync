// src/components/admin/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  // クラス名を動的に生成
  const getLinkClass = (path: string) => 
    `text-2xl transition-all duration-200 flex items-center justify-center w-10 h-10 rounded 
    /* ホバー時の背景色: ライトなら薄いグレー、ダークなら薄い紺 */
    hover:bg-slate-100 dark:hover:bg-slate-800/50 
    ${
      isActive(path) 
        /* アクティブ時: ライトなら濃いシアン、ダークなら蛍光シアン+発光 */
        ? "text-cyan-600 dark:text-cyan-400 scale-110 dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
        /* 非アクティブ時: ライトならグレー、ダークなら少し暗いグレー */
        : "text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-300 hover:scale-105"
    }`;

  return (
    // サイドバー全体の背景と境界線
    <aside className="w-16 flex flex-col items-center py-8 border-r transition-colors duration-300
      bg-white/90 border-slate-200 
      dark:bg-[#0F172A]/90 dark:border-slate-700/50 
      backdrop-blur-sm z-20">
      
      {/* ロゴ部分 */}
      <div className="w-10 h-10 rounded-full mb-8 flex items-center justify-center font-bold text-xs transition-colors duration-300
        bg-cyan-600 text-white shadow-md
        dark:bg-cyan-500 dark:text-black dark:shadow-[0_0_15px_#06b6d4]">
        V
      </div>

      <nav className="flex flex-col gap-6">
        
        <Link href="/admin/dashboard" className={getLinkClass("/admin/dashboard")}>
          🏠
        </Link>

        <Link href="/admin/schedule" className={getLinkClass("/admin/schedule")}>
          📅
        </Link>

        <Link href="/admin/tasks" className={getLinkClass("/admin/tasks")}>
          ☑️
        </Link>

        <Link href="/admin/booking" className={getLinkClass("/admin/booking")}>
          🏢
        </Link>

        <Link href="/admin/settings" className={getLinkClass("/admin/settings")}>
          ⚙️
        </Link>

      </nav>
    </aside>
  );
}