"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { auth } from "@/lib/firebase"; 
import { signOut } from "firebase/auth";

const ADMIN_EMAIL = "harutsugu.0528@gmail.com";

export default function StaffSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { themeMode } = useTheme();
  
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/staff/dashboard", icon: "📊" },
    { name: "Schedule", path: "/staff/schedule", icon: "📅" },
    { name: "Chat", path: "/staff/chat", icon: "💬" },
    { name: "Assets", path: "/staff/assets", icon: "📁" },
    { name: "Settings", path: "/staff/settings", icon: "⚙️" },
  ];

  // ★ 背景を bg-transparent に戻しました
  const containerClass = themeMode === 'dark' 
    ? "w-20 md:w-64 border-r border-brand/10 bg-transparent flex flex-col justify-between transition-all duration-300 shrink-0" 
    : "w-20 md:w-64 border-r border-slate-200 bg-transparent flex flex-col justify-between transition-all duration-300 shrink-0";

  const itemBaseClass = "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-bold mb-1 mx-2";
  
  const itemActiveClass = themeMode === 'dark' 
    ? "bg-brand text-black shadow-[0_0_15px_rgba(var(--brand-rgb),0.4)]" 
    : "bg-green-500 text-white shadow-lg shadow-green-500/30";
    
  const itemInactiveClass = themeMode === 'dark' 
    ? "text-slate-400 hover:text-white hover:bg-white/5" 
    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100";

  return (
    <aside className={containerClass}>
      <div>
        <div className="h-24 flex items-center justify-center md:justify-start md:px-8">
          <div className="text-center md:text-left">
            <h1 className={`font-black text-2xl tracking-tighter ${themeMode === 'dark' ? "text-white" : "text-slate-800"}`}>
              <span className={themeMode === 'dark' ? "text-brand" : "text-green-500"}>V</span>-SYNC
            </h1>
            <p className={`text-[10px] tracking-widest font-mono hidden md:block ${themeMode === 'dark' ? "text-slate-500" : "text-slate-400"}`}>STAFF PORTAL</p>
          </div>
        </div>

        <nav className="mt-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.path} href={item.path} className={`${itemBaseClass} ${isActive ? itemActiveClass : itemInactiveClass}`}>
                <span className="text-xl">{item.icon}</span>
                <span className="hidden md:block text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 space-y-2 relative" ref={menuRef}>
        
        {/* メニューポップアップ */}
        {isAccountMenuOpen && (
          <div className={`absolute bottom-full left-4 right-4 mb-2 rounded-xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in duration-200 z-50
            ${themeMode === 'dark' ? 'bg-[#0F1515] border-slate-700' : 'bg-white border-slate-100'}
          `}>
            
            {/* Admin通路 (メニュー内) */}
            {isAdmin && (
              <Link 
                href="/admin/dashboard" 
                className={`flex items-center gap-2 w-full text-left p-3 text-xs font-bold transition border-b
                  ${themeMode === 'dark' ? 'text-brand hover:bg-white/5 border-slate-800' : 'text-blue-600 hover:bg-slate-50 border-slate-100'}
                `}
              >
                <span>🔐</span> Admin Dashboard
              </Link>
            )}

            <button onClick={handleLogout} className="w-full text-left p-3 text-xs font-bold text-red-500 hover:bg-red-500/10">
              Log Out
            </button>
          </div>
        )}

        {/* プロフィールカード */}
        <div 
          onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all select-none cursor-pointer group
            ${themeMode === 'dark' ? 'border-brand/20 bg-black/20 hover:border-brand' : 'border-slate-200 bg-white/50 hover:border-green-400'}
          `}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 relative shadow-md
             ${themeMode === 'dark' ? 'bg-brand text-black' : 'bg-green-500 text-white'}
          `}>
            {user?.displayName?.charAt(0) || "U"}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          </div>

          <div className="hidden md:block overflow-hidden flex-1">
            <p className={`text-sm font-bold truncate ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              {user?.displayName || "Staff"}
            </p>
            <p className={`text-[10px] truncate ${themeMode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
              {isAdmin ? "Administrator" : "General Staff"}
            </p>
          </div>
          <span className={`text-[10px] ${themeMode === 'dark' ? 'text-slate-500' : 'text-slate-300'}`}>▲</span>
        </div>
      </div>
    </aside>
  );
}