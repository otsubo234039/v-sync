"use client";
import { Asset } from "@/models/Asset";

type Props = {
  asset: Asset | null;
  onClose: () => void;
};

export default function AssetDetailModal({ asset, onClose }: Props) {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200" onClick={onClose}>
      <div className="bg-[#0A1010] border border-brand/30 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]" onClick={e => e.stopPropagation()}>
        
        {/* プレビューエリア */}
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

        {/* 情報エリア */}
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
            <button className="w-full py-3 bg-brand text-black hover:brightness-110 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 transition-all">
              <span>⬇</span> Download File
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}