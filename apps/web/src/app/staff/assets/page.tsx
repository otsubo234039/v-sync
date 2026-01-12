"use client";
import StaffSidebar from "@/components/staff/StaffSidebar";
import AssetDetailModal from "@/components/staff/AssetDetailModal"; // コンポーネント
import { useStaffAssets } from "@/hooks/useStaffAssets"; // フック

export default function StaffAssetsPage() {
  const {
    loading,
    backgroundStyle,
    baseTextColor,
    themeMode,
    filter, setFilter,
    searchTerm, setSearchTerm,
    selectedAsset, setSelectedAsset,
    deniedId,
    filteredAssets,
    handleAssetClick
  } = useStaffAssets();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand">LOADING...</div>;

  return (
    <div 
      className={`flex h-screen w-screen font-sans relative overflow-hidden ${baseTextColor}`}
      style={backgroundStyle}
    >
      <div className="relative z-10 flex w-full h-full">
        <StaffSidebar />
        
        <main className="flex-1 p-8 h-full flex flex-col overflow-hidden">
          
          {/* ヘッダー */}
          <header className="flex justify-between items-end mb-8 shrink-0">
            <div>
              <h2 className="text-xs font-bold tracking-widest mb-1 text-brand">STAFF CONSOLE</h2>
              <h1 className={`text-3xl font-bold tracking-tight drop-shadow-[0_0_10px_rgba(var(--brand-rgb),0.3)] ${themeMode === 'dark' ? 'text-white' : 'text-brand'}`}>
                DIGITAL ASSETS
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input type="text" placeholder="Search..." className={`border border-brand/30 rounded-full py-2 px-4 pl-10 text-sm focus:border-brand outline-none w-48 transition ${themeMode === 'dark' ? 'bg-brand-dim text-white' : 'bg-white/50 text-slate-800'}`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <span className="absolute left-3 top-2.5 text-brand text-xs">🔍</span>
              </div>
              <button className="bg-brand hover:brightness-110 text-black px-6 py-2 rounded-full font-bold shadow-lg transition text-sm flex items-center gap-2"><span>☁️</span> Upload</button>
            </div>
          </header>

          {/* フィルターボタン */}
          <div className="flex gap-2 mb-6 shrink-0 border-b border-brand/20 pb-1">
             {['all', 'image', 'audio', 'file'].map(f => (
               <button key={f} onClick={() => setFilter(f as any)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f ? "bg-brand text-black shadow-lg shadow-brand/20" : "text-slate-400 hover:text-brand hover:bg-brand/5"}`}>
                 {f === 'all' ? 'ALL FILES' : f === 'image' ? '🖼️ IMAGES' : f === 'audio' ? '🎵 AUDIO' : '📄 DOCS'}
               </button>
             ))}
          </div>

          {/* アセットグリッド */}
          <div className="flex-1 overflow-y-auto pr-2 pb-10 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredAssets.map(asset => {
                const isDenied = deniedId === asset.id;
                
                return (
                  <div 
                    key={asset.id} 
                    onClick={() => handleAssetClick(asset)}
                    className={`group rounded-xl overflow-hidden transition-all cursor-pointer flex flex-col relative h-[280px]
                      ${themeMode === 'dark' 
                          ? "bg-brand-dim border border-brand/20 hover:border-brand hover:shadow-[0_0_20px_rgba(var(--brand-rgb),0.2)]"
                          : "bg-brand/5 border border-brand/30 shadow-sm hover:border-brand hover:bg-brand/10 hover:shadow-[0_0_20px_rgba(var(--brand-rgb),0.3)]"
                      }
                      ${isDenied ? "animate-[shake_0.5s_ease-in-out] border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)]" : ""}
                    `}
                  >
                    {/* サムネイル */}
                    <div className={`h-32 relative flex items-center justify-center overflow-hidden shrink-0 bg-black/50`}>
                      {(asset.type === 'image' || asset.type === 'video') ? (
                          <div className="w-full h-full relative">
                            <img src={asset.url} alt={asset.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            {asset.type === 'video' && (<div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition"><span className="text-4xl text-white drop-shadow-lg group-hover:rotate-12 transition-transform">▶</span></div>)}
                          </div>
                      ) : (
                        <div className={`text-4xl transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-6 text-brand`}>
                          {asset.type === 'audio' ? '🎵' : '📄'}
                        </div>
                      )}
                      
                      {/* アクセス拒否オーバーレイ */}
                      {isDenied && (
                        <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center backdrop-blur-sm animate-in fade-in zoom-in duration-200">
                           <span className="text-red-200 font-bold text-sm tracking-widest border-2 border-red-400 px-2 py-1 rotate-[-12deg]">ACCESS DENIED</span>
                        </div>
                      )}
                    </div>

                    {/* 情報エリア */}
                    <div className="p-3 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider border px-1.5 rounded bg-black text-brand border-brand/30`}>{asset.category}</span>
                      </div>
                      <h3 className={`text-sm font-bold leading-tight mb-1 line-clamp-2 ${themeMode === 'dark' ? "text-white" : "text-slate-800"}`} title={asset.title}>{asset.title}</h3>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mb-3"><span>{asset.size}</span><span>{asset.date}</span></div>
                      <div className={`mt-auto pt-2 border-t border-brand/10`}>
                        <button className={`w-full py-1.5 rounded text-xs font-bold transition flex items-center justify-center gap-1 group/btn bg-brand/20 text-brand hover:bg-brand hover:text-black`}>
                          <span className="group-hover/btn:translate-y-0.5 transition-transform">⬇</span> Download
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* 詳細モーダル */}
      <AssetDetailModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
      
      <style jsx global>{` @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px) rotate(-5deg); } 75% { transform: translateX(5px) rotate(5deg); } } `}</style>
    </div>
  );
}