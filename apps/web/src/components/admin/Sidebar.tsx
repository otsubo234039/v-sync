"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const getLinkClass = (path: string) => 
    `text-2xl transition-all duration-300 flex items-center justify-center w-10 h-10 rounded-lg
    hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400
    ${
      isActive(path) 
        ? "text-cyan-400 scale-110 bg-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.2)] border border-cyan-500/30" 
        : "hover:scale-105"
    }`;

  return (
    <aside className="w-20 flex flex-col items-center py-8 border-r border-slate-800 bg-[#0F172A]/80 backdrop-blur-xl z-50">
      
      {/* Admin Logo */}
      <div className="w-10 h-10 rounded-xl mb-10 flex items-center justify-center font-bold text-lg
        bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
        A
      </div>

      <nav className="flex flex-col gap-8">
        <Link href="/admin/dashboard" className={getLinkClass("/admin/dashboard")} title="Dashboard">🏠</Link>
        <Link href="/admin/members" className={getLinkClass("/admin/members")} title="Members">👥</Link>
        <Link href="/admin/schedule" className={getLinkClass("/admin/schedule")} title="Schedule">📅</Link>
        <Link href="/admin/settings" className={getLinkClass("/admin/settings")} title="Settings">⚙️</Link>
      </nav>
    </aside>
  );
}