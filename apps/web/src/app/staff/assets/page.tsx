"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import StaffSidebar from "@/components/staff/StaffSidebar";
import { useTheme } from "@/context/ThemeContext"; 

type Asset = {
  id: number;
  title: string;
  type: 'image' | 'video' | 'audio' | 'file'; // system型を削除
  category: string;
  size: string;
  date: string;
  url: string;
  description?: string;
  requiredRole?: 'admin' | 'staff' | 'all';
};

// ★ Admin Portal (id:999) を削除しました
const MOCK_ASSETS: Asset[] = [
  { id: 1, title: "3周年キービジュアル_最終稿", type: "image", category: "art", size: "12.5 MB", date: "2024-12-20", url: "https://picsum.photos/seed/vtuber1/800/600", description: "3周年記念ライブのメインビジュアルです。", requiredRole: 'all' },
  { id: 2, title: "新衣装_三面図_設定資料", type: "image", category: "character", size: "4.2 MB", date: "2024-11-15", url: "https://picsum.photos/seed/vtuber2/600/800", description: "新衣装の背面・側面資料です。", requiredRole: 'staff' },
  { id: 3, title: "雑談配信BGM_v2.mp3", type: "audio", category: "bgm", size: "8.1 MB", date: "2024-10-01", url: "", description: "雑談配信用のループBGM。", requiredRole: 'all' },
  { id: 6, title: "待機画面ループ動画.mp4", type: "video", category: "video", size: "150 MB", date: "2024-12-25", url: "https://picsum.photos/seed/vtuber4/800/600", description: "配信開始前の待機画面用動画素材。", requiredRole: 'all' },
  { id: 5, title: "ガイドライン規定書.pdf", type: "file", category: "doc", size: "540 KB", date: "2024-08-05", url: "", description: "ガイドライン。", requiredRole: 'all' },
];

function AssetDetailModal({ asset, onClose }: { asset: Asset, onClose: () => void }) {
  if (!asset) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200" onClick={onClose}>
      <div className="bg-[#0A1010] border border-brand/30 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex-1 bg-black flex items-center justify-center p-8 relative min-h-[300px]">
           {(asset.type === 'image' || asset.type === 'video') ? (
            <div className="w-full h-full flex items-center justify-center relative">
               <img src={asset.url} alt={asset.title} className="w-full h-full object-contain max-h-[500px]" />
            </div>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce text-brand">{asset.type === 'audio' ? '🎵' : '📄'}</div>
              <p className="text-slate-500 font-mono">PREVIEW NOT AVAILABLE</p>
            </div>
          )}
          <button onClick={onClose} className="absolute top-4 left-4 md:hidden text-white bg-black/50 p-2 rounded-full">✕</button>
        </div>
        <div className="w-full md:w-96 bg-[#050505] p-8 flex flex-col border-l border-brand/20">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-bold text-brand uppercase tracking-wider border border-brand/30 px-2 py-1 rounded bg-black">{asset.category}</span>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl hidden md:block">×</button>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 leading-snug">{asset.title}</h2>
          <div className="space-y-4 mb-8 text-sm text-slate-300">
            <p className="text-slate-400 leading-relaxed text-xs">{asset.description}</p>
          </div>
          <div className="mt-auto space-y-3">
            <button className="w-full py-3 bg-brand text-black hover:brightness-110 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 transition-all"><span>⬇</span> Download File</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StaffAssetsPage() {
  const { loading } = useAuth();
  const router = useRouter();
  const { backgroundStyle, baseTextColor, themeMode } = useTheme();

  const [filter, setFilter] = useState<'all' | 'image' | 'audio' | 'file'>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [deniedId, setDeniedId] = useState<number | null>(null);

  const filteredAssets = MOCK_ASSETS.filter(asset => {
    const matchesFilter = filter === 'all' ? true : filter === 'image' ? (asset.type === 'image' || asset.type === 'video') : filter === 'audio' ? asset.type === 'audio' : asset.type === 'file';
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAssetClick = (asset: Asset) => {
    // Admin専用アイテムは（そもそも表示されないはずですが）拒否
    if (asset.requiredRole === 'admin') { 
       triggerDenial(asset.id); 
       return;
    }
    // ここでスタッフ権限チェックなどを入れても良いですが、現状は全員アクセス可とします
    setSelectedAsset(asset);
  };

  const triggerDenial = (id: number) => {
    setDeniedId(id);
    setTimeout(() => setDeniedId(null), 500);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand">LOADING...</div>;

  return (
    <div 
      className={`flex h-screen w-screen font-sans relative overflow-hidden ${baseTextColor}`}
      style={backgroundStyle}
    >
      <div className="relative z-10 flex w-full h-full">
        <StaffSidebar />
        
        <main className="flex-1 p-8 h-full flex flex-col overflow-hidden">
          
          <header className="flex justify-between items-end mb-8 shrink-0">
            <div>
              <h2 className="text-xs font-bold tracking-widest mb-1 text-brand">STAFF CONSOLE</h2>
              <h1 className={`text-3xl font-bold tracking-tight drop-shadow-[0_0_10px_rgba(var(--brand-rgb),0.3)] ${themeMode === 'dark' ? 'text-white' : 'text-brand'}`}>
                DIGITAL ASSETS
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {/* ★ Admin/Staff 切り替えスイッチを削除しました */}
              
              <div className="relative">
                <input type="text" placeholder="Search..." className={`border border-brand/30 rounded-full py-2 px-4 pl-10 text-sm focus:border-brand outline-none w-48 transition ${themeMode === 'dark' ? 'bg-brand-dim text-white' : 'bg-white/50 text-slate-800'}`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <span className="absolute left-3 top-2.5 text-brand text-xs">🔍</span>
              </div>
              <button className="bg-brand hover:brightness-110 text-black px-6 py-2 rounded-full font-bold shadow-lg transition text-sm flex items-center gap-2"><span>☁️</span> Upload</button>
            </div>
          </header>

          <div className="flex gap-2 mb-6 shrink-0 border-b border-brand/20 pb-1">
             {['all', 'image', 'audio', 'file'].map(f => (
               <button key={f} onClick={() => setFilter(f as any)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === f ? "bg-brand text-black shadow-lg shadow-brand/20" : "text-slate-400 hover:text-brand hover:bg-brand/5"}`}>
                 {f === 'all' ? 'ALL FILES' : f === 'image' ? '🖼️ IMAGES' : f === 'audio' ? '🎵 AUDIO' : '📄 DOCS'}
               </button>
             ))}
          </div>

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
      {selectedAsset && <AssetDetailModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />}
      <style jsx global>{` @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px) rotate(-5deg); } 75% { transform: translateX(5px) rotate(5deg); } } `}</style>
    </div>
  );
}