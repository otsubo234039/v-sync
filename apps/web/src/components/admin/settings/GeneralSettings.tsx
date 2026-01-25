"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { COLOR_PRESETS } from "@/models/Theme";
import EditProfileModal from "@/components/admin/EditProfileModal";

export default function GeneralSettings() {
  const { user } = useAuth();
  const { themeMode, setThemeMode, accentColor, setAccentColor } = useTheme();
  const router = useRouter();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const handleLogout = async () => {
    if (confirm("ログアウトしますか？")) {
      await signOut(auth);
      router.push("/");
    }
  };

  return (
    <div className="max-w-5xl pb-20 pt-4">
      
      {/* ヘッダー */}
      <div className="mb-10">
        <h2 className="text-xs font-bold tracking-widest mb-1 uppercase" style={{ color: accentColor }}>
          SYSTEM SETTINGS
        </h2>
        <h1 className="text-3xl font-normal text-slate-800 dark:text-white">
          THEME CONFIGURATION
        </h1>
      </div>

      <div className="space-y-6">
        
        {/* BACKGROUND MODE CARD */}
        <div className="bg-white dark:bg-[#111827] rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
           <h3 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-wider">Background Mode</h3>
           <div className="grid grid-cols-2 gap-6">
              
              {/* DARK MODE BUTTON (グラデーション強化版) */}
              <button 
                onClick={() => setThemeMode('dark')}
                className={`h-24 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 border relative overflow-hidden group
                  ${themeMode === 'dark' 
                    ? 'border-transparent scale-[1.02]' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                style={themeMode === 'dark' ? {
                  // ベース色
                  backgroundColor: '#050a0e',
                  // ボーダー色
                  borderColor: accentColor,
                  borderWidth: '1px',
                  // ★ここがポイント: アクセントカラーを使ったグラデーション
                  backgroundImage: `linear-gradient(135deg, ${accentColor}40 0%, transparent 60%)`,
                  // ★発光エフェクト (外側の光 + 内側の光)
                  boxShadow: `0 0 25px ${accentColor}30, inset 0 0 10px ${accentColor}20`
                } : {}}
              >
                 <span className="text-2xl relative z-10 drop-shadow-md">🌙</span>
                 <span className={`font-bold text-sm tracking-widest relative z-10 ${themeMode === 'dark' ? 'text-white' : 'text-slate-500'}`}>
                   DARK MODE
                 </span>
                 
                 {/* 選択時のキラッとした反射エフェクト */}
                 {themeMode === 'dark' && (
                   <div className="absolute inset-0 bg-white/5 pointer-events-none" />
                 )}
              </button>

              {/* LIGHT MODE BUTTON */}
              <button 
                onClick={() => setThemeMode('light')}
                className={`h-24 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 border relative overflow-hidden
                  ${themeMode === 'light' 
                    ? 'scale-[1.02]' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                style={themeMode === 'light' ? {
                  backgroundColor: '#ffffff',
                  borderColor: accentColor,
                  // 薄いグラデーション
                  backgroundImage: `linear-gradient(135deg, ${accentColor}15 0%, transparent 60%)`,
                  boxShadow: `0 0 20px ${accentColor}15`
                } : {}}
              >
                 <span className="text-2xl relative z-10">☀️</span>
                 <span className={`font-bold text-sm tracking-widest relative z-10 ${themeMode === 'light' ? 'text-slate-900' : 'text-slate-500'}`}>
                   LIGHT MODE
                 </span>
              </button>
           </div>
        </div>

        {/* ACCENT COLOR CARD */}
        <div className="bg-white dark:bg-[#111827] rounded-xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-normal text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            🎨 Accent Color
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {COLOR_PRESETS.map((preset) => {
              const isSelected = accentColor === preset.value;
              return (
                <button
                  key={preset.value}
                  onClick={() => setAccentColor(preset.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 border
                    ${isSelected 
                      ? 'bg-slate-50 dark:bg-slate-800/50 border-2 scale-105 shadow-sm' 
                      : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  style={{ borderColor: isSelected ? accentColor : 'transparent' }}
                >
                  <div 
                    className="w-4 h-4 rounded-full shadow-sm ring-2 ring-white dark:ring-slate-700" 
                    style={{ backgroundColor: preset.value }} 
                  />
                  <span className={`text-sm ${isSelected ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Hex */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Custom Hex Color</label>
            <div className="flex gap-4">
               <div className="w-12 h-12 rounded-lg shadow-inner border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0" style={{ backgroundColor: accentColor }}></div>
               <div className="flex-1">
                  <input 
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm outline-none focus:border-slate-400 transition text-slate-700 dark:text-white"
                  />
               </div>
            </div>
          </div>
        </div>
      </div>
      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
    </div>
  );
}