// src/components/admin/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const getLinkClass = (path: string) => 
    `text-2xl transition-all duration-200 flex items-center justify-center w-10 h-10 rounded hover:bg-slate-800/50 ${
      isActive(path) 
        ? "text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" 
        : "text-slate-500 hover:text-cyan-300 hover:scale-105"
    }`;

  return (
    <aside className="w-16 flex flex-col items-center py-8 border-r border-slate-700/50 bg-[#0F172A]/90 backdrop-blur-sm z-20">
      <div className="w-10 h-10 bg-cyan-500 rounded-full mb-8 shadow-[0_0_15px_#06b6d4] flex items-center justify-center font-bold text-black text-xs">
        V
      </div>

      <nav className="flex flex-col gap-6">
        
        <Link href="/admin/dashboard" className={getLinkClass("/admin/dashboard")}>
          🏠
        </Link>

        <Link href="/admin/schedule" className={getLinkClass("/admin/schedule")}>
          📅
        </Link>

        {/* ■■■ 追加: タスク管理ページへのリンク ■■■ */}
        <Link href="/admin/tasks" className={getLinkClass("/admin/tasks")}>
          ☑️
        </Link>

        <Link href="/admin/members" className={getLinkClass("/admin/members")}>
          👥
        </Link>

        <Link href="/admin/settings" className={getLinkClass("/admin/settings")}>
          ⚙️
        </Link>

      </nav>
    </aside>
  );
}