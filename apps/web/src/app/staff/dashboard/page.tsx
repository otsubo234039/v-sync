"use client";
import StaffSidebar from "@/components/staff/StaffSidebar";
import SystemAccessModal from "@/components/common/SystemAccessModal"; // 切り出したモーダル
import { useStaffDashboard } from "@/hooks/useStaffDashboard"; // 切り出したロジック

export default function StaffDashboard() {
  // ロジック呼び出し
  const {
    user,
    loading,
    themeMode,
    backgroundStyle,
    baseTextColor,
    isAdmin,
    showSystemModal,
    setShowSystemModal,
    handleSystemSuccess,
    dateStr,
    timeStr
  } = useStaffDashboard();

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
               <p className={`text-xs font-mono ${themeMode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{dateStr}</p>
               <p className="text-xl font-bold font-mono text-brand">{timeStr}</p>
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

            {/* 3. 提出物チェック */}
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

      {/* モーダル表示 */}
      {showSystemModal && (
        <SystemAccessModal 
          onClose={() => setShowSystemModal(false)} 
          onSuccess={handleSystemSuccess} 
        />
      )}
    </div>
  );
}