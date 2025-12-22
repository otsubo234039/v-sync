// src/app/page.tsx
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, role, login, logout, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0F172A] flex items-center justify-center overflow-hidden">
        <div className="animate-spin h-10 w-10 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    // ▼ 変更点: min-h-screen を h-screen に変更し、w-screen と fixed を追加して完全固定
    <main className="fixed inset-0 h-screen w-screen bg-[#0F172A] text-white overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* ■■■ 3D背景装飾エリア ■■■ */}
      <div className="absolute inset-0 pointer-events-none z-0">
        
        {/* 1. 3Dグリッド (床) */}
        <div className="absolute inset-0 overflow-hidden" style={{ perspective: '1000px' }}>
          <div 
            className="absolute -left-1/2 -bottom-1/2 w-[200%] h-[200%] origin-bottom bg-repeat"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.4) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              transform: 'rotateX(60deg)',
              maskImage: 'linear-gradient(to top, black 0%, transparent 80%)',
              WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 80%)'
            }}
          />
        </div>

        {/* 2. 中央の巨大なグロー効果 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* コンテンツエリア */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full p-6">
        
        {/* ロゴエリア */}
        <div className="mb-12 text-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            V-Sync
          </h1>
          <p className="mt-4 text-slate-400 tracking-widest text-sm md:text-base uppercase">
            Virtual Talent Management System
          </p>
        </div>

        {user ? (
          /* ■ ログイン後の表示 */
          <div className="w-full max-w-4xl animate-fade-in-up">
            
            {/* ユーザーカード */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-slate-800/60 backdrop-blur-md border border-slate-700/50 p-6 rounded-2xl mb-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-[2px] shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                   <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xl font-bold">
                     {user.displayName?.charAt(0) || "U"}
                   </div>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider">Welcome back</p>
                  <h2 className="text-2xl font-bold">{user.displayName}</h2>
                </div>
              </div>
              
              <div className="px-6 py-2 bg-slate-900/80 rounded-full border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                 <span className="text-cyan-400 font-bold uppercase tracking-widest text-sm">
                   Role: {role || "Unassigned"}
                 </span>
              </div>
            </div>

            {/* メインアクション */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {role === "admin" && (
                <button
                  onClick={() => router.push("/admin/dashboard")}
                  className="group relative h-40 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700 p-8 text-left transition-all hover:-translate-y-1 hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-hidden backdrop-blur-sm"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110">
                    <svg className="w-32 h-32 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition">Dashboard</h3>
                  <p className="text-slate-400 text-sm">
                    全体進捗の確認・キャスト管理・ログ監査などの管理者機能へアクセスします。
                  </p>
                </button>
              )}

              <button className="group h-40 bg-slate-800/40 rounded-2xl border border-slate-700/50 p-8 text-left transition-all hover:bg-slate-800/60 hover:border-slate-500 backdrop-blur-sm">
                 <h3 className="text-xl font-bold text-slate-300 mb-2">Account Settings</h3>
                 <p className="text-slate-500 text-sm">プロフィールの編集や通知設定を行います。</p>
              </button>
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={logout}
                className="text-slate-500 hover:text-red-400 transition text-sm flex items-center justify-center gap-2 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Sign Out
              </button>
            </div>

          </div>
        ) : (
          /* ■ ログイン前の表示 */
          <div className="flex flex-col gap-6 animate-fade-in relative z-20">
             <button
              onClick={login}
              className="relative px-12 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-lg rounded-full transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10">Google Login</span>
              <span className="absolute inset-0 rounded-full ring-2 ring-white/20 animate-pulse"></span>
            </button>
            <p className="text-slate-500 text-sm text-center">
              Authorized Personnel Only
            </p>
          </div>
        )}
      </div>
    </main>
  );
}