"use client";
import { Timestamp } from "firebase/firestore";
import { ScheduleWithMember } from "@/hooks/useAdminOnAir";

type Props = {
  schedule: ScheduleWithMember;
};

export default function StreamCard({ schedule }: Props) {
  const startDate = schedule.startAt instanceof Timestamp ? schedule.startAt.toDate() : new Date(schedule.startAt);
  const isLive = new Date() >= startDate;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-lg group">
      
      {/* サムネイルエリア (擬似) */}
      <div className="aspect-video bg-slate-800 relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        {/* 背景画像がないので色で表現 */}
        <div className={`absolute inset-0 opacity-50 bg-gradient-to-br ${schedule.member?.color || 'from-gray-700 to-gray-900'}`} />
        
        <span className="relative z-20 text-white font-bold text-lg drop-shadow-md px-4 text-center">
          {schedule.title}
        </span>

        <div className="absolute top-3 left-3 z-20 flex gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm ${isLive ? 'bg-red-600 animate-pulse' : 'bg-slate-600'}`}>
            {isLive ? 'LIVE' : 'UPCOMING'}
          </span>
        </div>
        
        <div className="absolute bottom-3 right-3 z-20 text-white text-xs font-mono bg-black/50 px-2 rounded">
          {startDate.toLocaleTimeString('ja-JP', {hour: '2-digit', minute:'2-digit'})} ~
        </div>
      </div>

      {/* 情報エリア */}
      <div className="p-4 flex gap-3">
        <div 
          className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold shadow-md"
          style={{ background: schedule.member?.color || '#555' }}
        >
          {schedule.member?.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{schedule.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{schedule.member?.name}</p>
          
          {/* メトリクス (ダミー) */}
          <div className="flex gap-4 mt-3 text-xs font-mono text-slate-600 dark:text-slate-500">
            <div className="flex items-center gap-1">
              👤 <span className="text-slate-900 dark:text-white font-bold">{Math.floor(Math.random() * 10000)}</span>
            </div>
            <div className="flex items-center gap-1">
              👍 <span className="text-slate-900 dark:text-white font-bold">{Math.floor(Math.random() * 5000)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="px-4 pb-4 pt-0">
        <button className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold rounded transition border border-slate-200 dark:border-slate-700">
          Go to Stream Studio ↗
        </button>
      </div>
    </div>
  );
}