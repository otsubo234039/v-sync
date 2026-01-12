"use client";
import Sidebar from "@/components/admin/Sidebar";
import StreamCard from "@/components/admin/onair/StreamCard";
import { useAdminOnAir } from "@/hooks/useAdminOnAir";

export default function OnAirPage() {
  const { schedules, loading } = useAdminOnAir();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 font-sans relative overflow-hidden transition-colors">
      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        
        <main className="flex-1 p-8 h-screen overflow-y-auto custom-scrollbar flex flex-col">
          
          <header className="mb-8 shrink-0 flex items-center gap-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <span className="text-red-500 animate-pulse">●</span> ON AIR MONITOR
            </h1>
            <span className="bg-red-500/10 text-red-500 text-xs px-2 py-1 rounded border border-red-500/20 font-bold">
              LIVE: {schedules.length} STREAMS
            </span>
          </header>

          {loading && <div className="text-center mt-20 text-slate-400">Loading streams...</div>}

          {!loading && schedules.length === 0 && (
            <div className="text-center mt-20 p-10 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl">
              <p className="text-slate-500">本日の配信予定はありません。</p>
              <p className="text-xs text-slate-400 mt-2">スケジュール画面で予定を追加してください。</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {schedules.map((schedule) => (
              <StreamCard key={schedule.id} schedule={schedule} />
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}