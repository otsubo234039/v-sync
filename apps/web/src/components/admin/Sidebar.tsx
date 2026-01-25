"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { accentColor } = useTheme();

  // ★高速化の鍵: ページ遷移を待たずに即座に光らせるための「仮の状態」
  const [optimisticPath, setOptimisticPath] = useState(pathname);

  // URLが実際に変わったら同期する（ブラウザバック等のため）
  useEffect(() => {
    setOptimisticPath(pathname);
  }, [pathname]);

  const MENU = [
    { label: "DASHBOARD", path: "/admin/dashboard" },
    { label: "TASKS",     path: "/admin/tasks" },
    { label: "DUE TODAY", path: "/admin/duetoday" },
    { label: "ON AIR",    path: "/admin/onair" },
    { label: "SCHEDULE",  path: "/admin/schedule" },
    { label: "BOOKING",   path: "/admin/booking" },
    { label: "MEMBERS",   path: "/admin/members" },
    { label: "SETTINGS",  path: "/admin/settings" },
  ];

  return (
    <aside className="w-64 flex flex-col h-full shrink-0 pt-6 px-4 bg-transparent transition-none">
      {/* ロゴエリア */}
      <div className="mb-10 px-2">
        <h1 
          className="text-2xl font-black tracking-tighter"
          style={{ color: accentColor }}
        >
          V-Sync
        </h1>
        <p className="text-[10px] tracking-[0.3em] font-bold mt-1 text-slate-400">ADMIN PORTAL</p>
      </div>

      {/* メニューエリア */}
      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
        {MENU.map((item) => {
          // ★変更: pathname ではなく optimisticPath で判定
          const isActive = optimisticPath === item.path;
          
          return (
            <Link
              key={item.path}
              href={item.path}
              // ★変更: クリックした瞬間にstateを更新して即座に見た目を変える
              onClick={() => setOptimisticPath(item.path)}
              // ★変更: duration-75 にしてアニメーションを爆速にする
              className={`flex items-center px-4 py-3 text-xs font-bold tracking-widest transition-all duration-75 rounded-lg active:scale-95
                ${!isActive && 'text-slate-500 hover:bg-slate-200/50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'}
              `}
              style={isActive ? {
                backgroundColor: accentColor, 
                color: '#ffffff',             
                boxShadow: `0 4px 15px ${accentColor}60`
              } : {}}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="py-6 px-2">
        <div className="flex items-center gap-2 opacity-50">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">SYSTEM ONLINE</span>
        </div>
      </div>
    </aside>
  );
}