"use client";
import { useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged, 
  setPersistence, 
  browserSessionPersistence 
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // どっちで認証中か (fingerprint | face | null)
  const [scanningType, setScanningType] = useState<"fingerprint" | "face" | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/admin/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // メールログイン処理
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      
      setIsRedirecting(true);
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setError("Login Failed");
      setLoading(false);
    }
  };

  // 生体認証（Googleログイン）処理
  const handleBiometricLogin = async (type: "fingerprint" | "face") => {
    setError("");
    setScanningType(type);

    try {
      await setPersistence(auth, browserSessionPersistence);
      const provider = new GoogleAuthProvider();
      
      await signInWithPopup(auth, provider);
      
      setScanningType(null);
      setIsRedirecting(true);
      setTimeout(() => router.push("/admin/dashboard"), 1500);

    } catch (err: any) {
      console.error(err);
      setScanningType(null);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError("Auth Failed");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#1a1b26] text-slate-800">
      
      {/* ■■■ 背景演出エリア ■■■ */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* グリッド背景 */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }} 
        />

        {/* 虹のアーチ */}
        <div 
          className="absolute bottom-[-50%] left-[-50%] w-[200%] h-[200%] rounded-full opacity-15 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 100%, rgba(255,0,0,0) 0%, rgba(255,0,0,0) 45%, rgba(255, 99, 71, 0.4) 48%, rgba(255, 165, 0, 0.4) 51%, rgba(255, 255, 0, 0.4) 54%, rgba(0, 128, 0, 0.4) 57%, rgba(0, 0, 255, 0.4) 60%, rgba(75, 0, 130, 0.4) 63%, rgba(238, 130, 238, 0.4) 66%, rgba(0,0,0,0) 70%)',
            filter: 'blur(40px)'
          }}
        />
        
        {/* 浮遊オブジェクト */}
        <div className="absolute top-10 left-10 text-cyan-400 opacity-20 text-6xl font-black animate-float-slow">▲</div>
        <div className="absolute bottom-20 right-20 text-pink-500 opacity-20 text-8xl font-black animate-float-medium">●</div>
        <div className="absolute top-1/3 right-1/4 text-yellow-400 opacity-20 text-5xl font-black animate-float-fast">✖</div>
        <div className="absolute bottom-1/3 left-1/4 text-purple-400 opacity-20 text-7xl font-black animate-float-slow">■</div>

        {/* 流れ星 */}
        <div className="shooting-star" style={{ top: '10%', left: '20%', animationDelay: '0s' }}></div>
        <div className="shooting-star" style={{ top: '30%', left: '70%', animationDelay: '2.5s' }}></div>
        <div className="shooting-star" style={{ top: '60%', left: '10%', animationDelay: '4s' }}></div>
        <div className="shooting-star" style={{ top: '20%', left: '90%', animationDelay: '1.2s' }}></div>
        <div className="shooting-star" style={{ top: '80%', left: '40%', animationDelay: '6s' }}></div>
      </div>

      {/* ■■■ ログインカード ■■■ */}
      <div className="relative z-10 w-full max-w-sm p-1">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-3xl blur-md opacity-60 animate-pulse"></div>
        
        <div className="relative bg-[#1e293b]/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-[10px] font-bold tracking-[0.4em] text-slate-400 mb-2 uppercase">Virtual Talent System</h2>
            <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 filter drop-shadow-sm">
              V-Sync
            </h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="group">
              <label className="block text-[10px] font-bold text-slate-400 mb-1 ml-1 group-focus-within:text-cyan-400 transition-colors">ADMIN ID</label>
              <input
                type="email"
                required
                className="w-full bg-[#0f172a] border-2 border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-all font-bold tracking-wide"
                placeholder="2434@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="group">
              <label className="block text-[10px] font-bold text-slate-400 mb-1 ml-1 group-focus-within:text-cyan-400 transition-colors">PASSWORD</label>
              <input
                type="password"
                required
                className="w-full bg-[#0f172a] border-2 border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 transition-all font-bold tracking-wide"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="text-red-400 text-xs text-center font-bold bg-red-500/10 py-2 rounded border border-red-500/20">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || isRedirecting || scanningType !== null}
              className={`w-full py-4 rounded-xl font-black text-sm tracking-widest transition-all duration-300 transform active:scale-95 shadow-lg
                ${isRedirecting 
                  ? "bg-emerald-500 text-white" 
                  : "bg-white text-slate-900 hover:bg-cyan-400 hover:text-white"
                }`}
            >
              {isRedirecting ? "CONNECTING..." : "LOGIN"}
            </button>
          </form>

          {/* ■■■ 生体認証エリア (2ボタン分離版) ■■■ */}
          <div className="mt-6 pt-6 border-t border-white/10">
             <p className="text-[10px] font-bold text-slate-500 mb-3 text-center uppercase tracking-wider">
               Register / Login with Biometrics
             </p>
             
             {/* ボタンを2つ並べるコンテナ */}
             <div className="flex justify-center gap-4">
               
               {/* ① 指紋認証ボタン */}
               <button 
                 onClick={() => handleBiometricLogin('fingerprint')}
                 disabled={scanningType !== null}
                 className={`w-20 h-20 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 relative group overflow-hidden
                   ${scanningType === 'fingerprint'
                     ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.4)]' 
                     : 'border-slate-700 bg-slate-800/50 hover:border-cyan-400 hover:bg-slate-800'
                   } ${scanningType === 'face' ? 'opacity-30' : ''}`}
               >
                  {/* ★修正: リアルな指紋パターンに変更 */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor" // fillに変更して塗りつぶし
                    className={`w-9 h-9 mb-1 transition-colors duration-300 relative z-10 ${scanningType === 'fingerprint' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'}`}
                  >
                     {/* 複雑な指紋パターンのパスデータ */}
                     <path d="M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-.11 0-.23-.04-.32-.12-.21-.19-.23-.5-.04-.71 1.13-1.22 1.76-2.85 1.76-4.58 0-2.58-1.23-4.93-3.26-6.31-.23-.16-.29-.47-.13-.7.16-.23.47-.29.7-.13 2.37 1.6 3.69 4.2 3.69 7.14 0 2.01-.73 3.9-2.05 5.32-.1.1-.24.17-.35.17zM12 14.8c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zm0-4c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>

                    {scanningType === 'fingerprint' && (
                      <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" />
                    )}
                  </svg>
                  <span className="text-[8px] font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">TOUCH ID</span>
                  
                  {scanningType === 'fingerprint' && (
                     <div className="absolute inset-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-scan-bar z-20 opacity-80"></div>
                  )}
               </button>

               {/* ② 顔認証ボタン */}
               <button 
                 onClick={() => handleBiometricLogin('face')}
                 disabled={scanningType !== null}
                 className={`w-20 h-20 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 relative group overflow-hidden
                   ${scanningType === 'face'
                     ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.4)]' 
                     : 'border-slate-700 bg-slate-800/50 hover:border-cyan-400 hover:bg-slate-800'
                   } ${scanningType === 'fingerprint' ? 'opacity-30' : ''}`}
               >
                  {/* 顔認証アイコン */}
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={`w-9 h-9 mb-1 transition-colors duration-300 relative z-10 ${scanningType === 'face' ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'}`}
                  >
                    {/* 左上枠 */}
                    <path d="M8 5H5a2 2 0 0 0-2 2v3" />
                    {/* 右上枠 */}
                    <path d="M16 5h3a2 2 0 0 1 2 2v3" />
                    {/* 左下枠 */}
                    <path d="M8 19H5a2 2 0 0 1-2-2v-3" />
                    {/* 右下枠 */}
                    <path d="M16 19h3a2 2 0 0 0 2-2v-3" />
                    
                    {/* 顔の中身 */}
                    <path d="M9 10h.01" />
                    <path d="M15 10h.01" />
                    <path d="M12 12v1" />
                    <path d="M10 16a2 2 0 0 0 4 0" />

                    {scanningType === 'face' && (
                      <animate attributeName="opacity" values="0.3;1;0.3" dur="0.8s" repeatCount="indefinite" />
                    )}
                  </svg>
                  <span className="text-[8px] font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">FACE ID</span>

                  {scanningType === 'face' && (
                     <div className="absolute inset-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-scan-bar z-20 opacity-80"></div>
                  )}
               </button>

             </div>
             
             {scanningType && (
               <p className="text-cyan-400 text-[10px] font-mono mt-3 animate-pulse tracking-widest text-center">
                 {scanningType === 'fingerprint' ? 'VERIFYING FINGERPRINT...' : 'SCANNING FACE...'}
               </p>
             )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-[9px] text-slate-500 font-mono opacity-50">
              © 2024 V-Sync / ANYCOLOR INSPIRED SYSTEM
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float-slow { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(10deg); } }
        @keyframes float-medium { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-30px) rotate(-20deg); } }
        @keyframes float-fast { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(45deg); } }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 5s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }

        .shooting-star {
          position: absolute;
          width: 150px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0));
          transform: rotate(-45deg);
          opacity: 0;
          animation: shooting-star 6s ease-out infinite;
          filter: drop-shadow(0 0 6px rgba(255,255,255,0.8));
        }
        .shooting-star::before {
          content: '';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 10px #fff, 0 0 20px #fff;
        }
        @keyframes shooting-star {
          0% { transform: translateX(0) translateY(0) rotate(-45deg); opacity: 0; }
          10% { opacity: 1; }
          40% { transform: translateX(-400px) translateY(400px) rotate(-45deg); opacity: 0; }
          100% { transform: translateX(-400px) translateY(400px) rotate(-45deg); opacity: 0; }
        }

        @keyframes scan-bar {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-bar {
          animation: scan-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}