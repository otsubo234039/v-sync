"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function StaffSidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  // クラス名を動的に生成
  const getLinkClass = (path: string) => 
    `text-2xl transition-all duration-300 flex items-center justify-center w-10 h-10 rounded-lg
    hover:bg-emerald-50 dark:hover:bg-emerald-800/30
    ${
      isActive(path) 
        ? "text-emerald-600 dark:text-emerald-400 scale-110 bg-emerald-100 dark:bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] border border-emerald-200 dark:border-emerald-500/30" 
        : "text-slate-400 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 hover:scale-105"
    }`;

  return (
    <aside className="w-20 flex flex-col items-center py-8 border-r transition-colors duration-300
      bg-slate-50/80 border-slate-200 
      dark:bg-[#0A2A22] dark:border-[#10B981]/20
      z-50 shadow-xl">
      
      {/* ロゴ部分 */}
      <div className="w-10 h-10 rounded-xl mb-10 flex items-center justify-center font-bold text-lg transition-all duration-300 transform hover:rotate-12
        bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/30
        dark:from-emerald-400 dark:to-emerald-600 dark:text-black">
        S
      </div>

      <nav className="flex flex-col gap-8">
        <Link href="/staff/dashboard" className={getLinkClass("/staff/dashboard")}>🏠</Link>
        <Link href="/staff/projects" className={getLinkClass("/staff/projects")}>📁</Link>
        <Link href="/staff/calendar" className={getLinkClass("/staff/calendar")}>📅</Link>
        <Link href="/staff/assets" className={getLinkClass("/staff/assets")}>📦</Link>
      </nav>
    </aside>
  );
}