"use client";
import { useTheme } from "@/context/ThemeContext";
import StaffSidebar from "@/components/staff/StaffSidebar";

export default function SettingsPage() {
  const { accentColor, setAccentColor, themeMode, setThemeMode, backgroundStyle, baseTextColor } = useTheme();

  const presets = [
    { name: "Hacker Green", value: "#10b981" },
    { name: "Snow White",   value: "#ffffff" },
    { name: "Onyx Black",   value: "#475569" },
    { name: "Cyber Blue",   value: "#06b6d4" },
    { name: "Crimson Red",  value: "#ef4444" },
    { name: "Royal Purple", value: "#a855f7" },
    { name: "Neon Pink",    value: "#ec4899" },
    { name: "Gold",         value: "#eab308" },
  ];

  return (
    <div className={`flex h-screen w-screen font-sans relative overflow-hidden ${baseTextColor}`} style={backgroundStyle}>
      <div className="relative z-10 flex w-full h-full">
        <StaffSidebar />
        <main className="flex-1 p-8 h-full flex flex-col overflow-y-auto custom-scrollbar">
          
          <header className="mb-10">
            <h2 className="text-xs font-bold tracking-widest mb-1 text-brand">SYSTEM SETTINGS</h2>
            <h1 className="text-3xl font-bold tracking-tight">THEME CONFIGURATION</h1>
          </header>

          {/* モード切り替え */}
          <div className={`mb-8 p-6 rounded-xl border ${themeMode === 'dark' ? 'bg-black/40 border-brand/20' : 'bg-white/60 border-brand/20 shadow-lg'}`}>
            <h3 className="text-sm font-bold mb-4 opacity-70">BACKGROUND MODE</h3>
            <div className="flex gap-4">
              <button onClick={() => setThemeMode('dark')} className={`flex-1 py-4 rounded-lg font-bold transition-all border flex flex-col items-center gap-2 ${themeMode === 'dark' ? 'bg-slate-900 border-brand text-brand shadow-[0_0_15px_rgba(var(--brand-rgb),0.3)]' : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'}`}>
                <span className="text-2xl">🌙</span><span>DARK MODE</span>
              </button>
              <button onClick={() => setThemeMode('light')} className={`flex-1 py-4 rounded-lg font-bold transition-all border flex flex-col items-center gap-2 ${themeMode === 'light' ? 'bg-white border-brand text-brand shadow-[0_0_15px_rgba(var(--brand-rgb),0.3)]' : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'}`}>
                <span className="text-2xl">☀️</span><span>LIGHT MODE</span>
              </button>
            </div>
          </div>

          {/* カラー設定 */}
          <div className={`max-w-2xl border rounded-2xl p-8 shadow-2xl backdrop-blur-sm ${themeMode === 'dark' ? 'bg-black/40 border-brand/20' : 'bg-white/60 border-brand/20'}`}>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">🎨 Accent Color</h3>
            
            {/* プリセット */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => setAccentColor(preset.value)}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${accentColor === preset.value ? 'border-brand bg-brand/10' : 'border-transparent hover:bg-brand/5'}`}
                >
                  <div className="w-4 h-4 rounded-full shadow-inner border border-black/10" style={{ backgroundColor: preset.value }} />
                  <span className="text-xs font-bold opacity-80">{preset.name}</span>
                </button>
              ))}
            </div>

            {/* ★ カラーコード入力欄 */}
            <div>
              <label className="block text-sm font-bold opacity-70 mb-2">CUSTOM HEX COLOR</label>
              <div className="flex gap-4">
                <input 
                  type="color" 
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-12 w-12 rounded cursor-pointer bg-transparent border-none"
                />
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-3.5 text-brand font-bold">#</span>
                  <input 
                    type="text" 
                    value={accentColor.replace('#', '')}
                    onChange={(e) => setAccentColor(`#${e.target.value}`)}
                    className={`w-full h-12 border rounded pl-8 pr-4 font-mono font-bold focus:border-brand outline-none transition-colors ${themeMode === 'dark' ? 'bg-black/50 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`}
                    placeholder="Enter Hex Code (e.g. FF00FF)"
                  />
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}