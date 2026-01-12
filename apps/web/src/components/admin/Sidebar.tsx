"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // Admin機能の全メニュー定義
  const MENU = [
    { label: "DASHBOARD", path: "/admin/dashboard", icon: "📊" },
    { label: "TASKS",     path: "/admin/tasks",     icon: "⚡" },
    { label: "DUE TODAY", path: "/admin/duetoday",  icon: "⚠️" },
    { label: "ON AIR",    path: "/admin/onair",     icon: "🔴" },
    { label: "SCHEDULE",  path: "/admin/schedule",  icon: "📅" },
    { label: "BOOKING",   path: "/admin/booking",   icon: "🎙️" },
    { label: "MEMBERS",   path: "/admin/members",   icon: "👥" },
    { label: "SETTINGS",  path: "/admin/settings",  icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0 z-20 transition-colors">
      
      {/* ロゴエリア */}
      <div className="p-6">
        <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
          V-Sync
        </h1>
        <p className="text-[10px] tracking-[0.3em] text-slate-400 font-bold mt-1">ADMIN PORTAL</p>
      </div>

      {/* メニューエリア */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {MENU.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold tracking-wide transition-all
                ${isActive 
                  ? "bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 shadow-sm" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
            >
              <span className="text-lg opacity-80 w-6 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* フッター */}
      <div className="p-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 opacity-50">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-mono text-slate-500">SYSTEM: ONLINE</span>
        </div>
      </div>
    </aside>
  );
}