"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import StaffSidebar from "@/components/staff/StaffSidebar";
import { useTheme } from "@/context/ThemeContext";

const ADMIN_EMAIL = "harutsugu.0528@gmail.com";

// ★ システムアクセス用モーダル（コードとしては残しますが、トリガーはサイドバー等に任せます）
function SystemAccessModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === "wearenijisanji" || input === "admin") {
      setStatus('success');
      setTimeout(onSuccess, 1000);
    } else {
      setStatus('error');
      setInput("");
      setTimeout(() => setStatus('idle'), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200" onClick={onClose}>
      <div className={`w-full max-w-md bg-black border-2 p-8 font-mono shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden transition-colors duration-300 ${status === 'idle' ? 'border-brand/50 shadow-brand/20' : ''} ${status === 'error' ? 'border-red-600 shadow-red-600/50 animate-[shake_0.5s_ease-in-out]' : ''} ${status === 'success' ? 'border-cyan-500 shadow-cyan-500/50' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
        <div className="relative z-10">
          <h2 className={`text-xl font-bold mb-6 tracking-widest border-b pb-2 ${status === 'error' ? 'text-red-500 border-red-500' : status === 'success' ? 'text-cyan-400 border-cyan-500' : 'text-brand border-brand/50'}`}>
            {status === 'error' ? '⚠ ACCESS DENIED' : status === 'success' ? '✔ IDENTITY VERIFIED' : '🔒 SYSTEM OVERRIDE'}
          </h2>
          <p className="text-xs text-slate-400 mb-4">Enter system passcode to proceed.</p>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 bg-[#0A1010] border border-slate-700 p-3 rounded mb-4 focus-within:border-brand transition-colors">
              <span className="text-brand font-bold">{">"}</span>
              <input ref={inputRef} type="password" className="bg-transparent border-none outline-none text-brand w-full font-bold placeholder-slate-700" placeholder="PASSWORD" value={input} onChange={e => setInput(e.target.value)} disabled={status === 'success'} />
              <span className="animate-pulse text-brand">_</span>
            </div>
            {status === 'error' && <p className="text-red-500 text-xs font-bold mb-4 animate-pulse">Invalid credentials.</p>}
            {status === 'success' && <p className="text-cyan-400 text-xs font-bold mb-4 animate-pulse">Redirecting to Admin Portal...</p>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-slate-500 text-xs hover:text-white">CANCEL</button>
              <button type="submit" disabled={status === 'success'} className={`px-6 py-2 rounded text-xs font-bold transition-all shadow-lg ${status === 'success' ? 'bg-cyan-600 text-white' : 'bg-brand text-black hover:brightness-110'}`}>LOGIN</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function StaffDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { backgroundStyle, baseTextColor, themeMode } = useTheme();
  
  const [showSystemModal, setShowSystemModal] = useState(false);
  const isAdmin = user?.email === ADMIN_EMAIL;

  const handleSystemSuccess = () => {
    router.push('/admin/dashboard');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand">LOADING...</div>;

  // カードの基本スタイル
  const cardClass = `border rounded-2xl p-6 transition backdrop-blur-sm flex flex-col justify-between ${themeMode === 'dark' ? 'bg-brand-dim border-brand/20 hover:border-brand/50' : 'bg-white/60 border-brand/20 shadow-sm hover:shadow-md hover:border-brand/40'}`;

  return (
    <div className={`flex h-screen w-screen font-sans relative overflow-hidden ${baseTextColor}`} style={backgroundStyle}>
      <div className="relative z-10 flex w-full h-full">
        <StaffSidebar />
        <main className="flex-1 p-8 h-full flex flex-col overflow-y-auto custom-scrollbar">
          
          {/* ヘッダー */}
          <header className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-xs font-bold tracking-widest mb-1 text-brand">WELCOME BACK</h2>
              <h1 className={`text-3xl font-bold tracking-tight ${themeMode === 'dark' ? 'text-white' : 'text-brand'}`} style={{ textShadow: "0 0 20px rgba(var(--brand-rgb), 0.3)" }}>
                {user?.displayName || "STAFF MEMBER"}
              </h1>
            </div>
            <div className="text-right">
               <p className={`text-xs font-mono ${themeMode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{new Date().toLocaleDateString()}</p>
               <p className="text-xl font-bold font-mono text-brand">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* 1. タスク */}
            <div className={`${cardClass} h-56`}>
              <div>
                <h3 className={`text-xs font-bold mb-4 flex items-center gap-2 ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>☑️</span> MY TASKS
                </h3>
                <div className={`text-3xl font-bold mb-1 ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  3 <span className="text-sm text-slate-500 font-normal">Active</span>
                </div>
                <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${themeMode === 'dark' ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  <div className="bg-brand h-full w-[60%] shadow-[0_0_10px_rgba(var(--brand-rgb),0.5)]" />
                </div>
              </div>
              <p className={`text-[10px] mt-2 ${themeMode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                Upcoming deadline: Today 18:00
              </p>
            </div>

            {/* 2. スケジュール */}
            <div className={`${cardClass} h-56`}>
              <div>
                <h3 className={`text-xs font-bold mb-4 flex items-center gap-2 ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>📅</span> SCHEDULE
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3 items-center">
                    <div className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-2 py-1 rounded">13:00</div>
                    <div>
                      <p className={`text-sm font-bold ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>定例MTG</p>
                      <p className="text-[10px] text-slate-400">運営チーム</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="bg-orange-500/10 text-orange-500 text-[10px] font-bold px-2 py-1 rounded">15:30</div>
                    <div>
                      <p className={`text-sm font-bold ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>スタジオ収録</p>
                      <p className="text-[10px] text-slate-400">第2スタジオ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. ★ 変更箇所: 提出物チェック (SYSTEM STATUS [ADMIN] を置換) */}
            <div className={`${cardClass} h-56 relative overflow-hidden group`}>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-xs font-bold flex items-center gap-2 ${themeMode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span>📥</span> SUBMISSIONS
                  </h3>
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-red-500/30">2 Pending</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                   {/* アイテム1 */}
                   <div className={`flex items-start gap-3 p-2 rounded-lg transition cursor-pointer ${themeMode === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] shrink-0 ${themeMode === 'dark' ? 'bg-white/10' : 'bg-slate-100'}`}>🍎</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className={`text-xs font-bold truncate ${themeMode === 'dark' ? 'text-white' : 'text-slate-700'}`}>歌ってみた音源確認</p>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">赤城リンゴ • 10 mins ago</p>
                    </div>
                  </div>
                  
                  {/* アイテム2 */}
                  <div className={`flex items-start gap-3 p-2 rounded-lg transition cursor-pointer ${themeMode === 'dark' ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] shrink-0 ${themeMode === 'dark' ? 'bg-white/10' : 'bg-slate-100'}`}>🌙</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className={`text-xs font-bold truncate ${themeMode === 'dark' ? 'text-white' : 'text-slate-700'}`}>新衣装三面図ラフ</p>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">月夜野ルナ • 1 hour ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className={`flex-1 border rounded-2xl p-6 ${themeMode === 'dark' ? 'bg-brand-dim border-brand/10' : 'bg-white/60 border-brand/20 shadow-sm'}`}>
            <h3 className="text-brand text-xs font-bold mb-4">📢 LATEST ANNOUNCEMENTS</h3>
            <div className="space-y-4">
               <div className="border-b border-brand/10 pb-4"><p className="text-xs text-slate-400 mb-1">2024.12.28</p><p className={`font-bold text-sm ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>年末年始のサーバーメンテナンスについて</p></div>
               <div className="border-b border-brand/10 pb-4"><p className="text-xs text-slate-400 mb-1">2024.12.25</p><p className={`font-bold text-sm ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>新衣装素材をAssetsに追加しました</p></div>
            </div>
          </div>
        </main>
      </div>
      {showSystemModal && <SystemAccessModal onClose={() => setShowSystemModal(false)} onSuccess={handleSystemSuccess} />}
      <style jsx global>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px) rotate(-5deg); } 75% { transform: translateX(5px) rotate(5deg); } }`}</style>
    </div>
  );
}