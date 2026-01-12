"use client";
import { useLoginPage } from "@/hooks/useLoginPage"; // Controllerを読み込む

export default function LoginPage() {
  // ロジックは全てフックにお任せ
  const {
    email, setEmail,
    password, setPassword,
    isLoading,
    error,
    handleGoogleLogin,
    handleEmailLogin
  } = useLoginPage();

  return (
    <div className="min-h-screen w-screen bg-[#050a0e] flex flex-col items-center justify-center relative overflow-hidden font-sans text-white">
      {/* 背景グリッド */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.15)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />
      
      <div className="z-10 w-full max-w-sm px-8 relative">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-black tracking-tighter mb-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            V-Sync
          </h1>
          <p className="text-xs tracking-[0.3em] text-slate-500 font-bold">VIRTUAL TALENT MANAGEMENT SYSTEM</p>
        </div>

        {/* Googleログインボタン */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white text-slate-900 font-bold py-3 rounded-lg flex items-center justify-center gap-3 transition hover:bg-slate-200 mb-6 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <span className="text-lg">G</span>
          <span className="text-sm">Googleでログイン</span>
        </button>

        <div className="relative flex items-center gap-4 mb-6 opacity-50">
          <div className="h-px bg-slate-700 flex-1" />
          <span className="text-[10px] text-slate-500">OR PASSWORD</span>
          <div className="h-px bg-slate-700 flex-1" />
        </div>

        {/* メールログインフォーム */}
        <form onSubmit={handleEmailLogin} className="space-y-4 mb-8">
          <div>
            <input 
              type="email" placeholder="Email Address"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:bg-white/10 transition"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input 
              type="password" placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:bg-white/10 transition"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-200 border border-cyan-700/50 font-bold py-3 rounded-lg text-xs tracking-widest transition disabled:opacity-50">
            {isLoading ? "..." : "LOGIN WITH PASSWORD"}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-slate-600">AUTHORIZED PERSONNEL ONLY</p>
      </div>
    </div>
  );
}