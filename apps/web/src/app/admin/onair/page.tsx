"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { Schedule, Member } from "../../../types";

export default function OnAirPage() {
  const [schedules, setSchedules] = useState<(Schedule & { member?: Member })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. メンバー取得
        const membersSnap = await getDocs(collection(db, "members"));
        const membersMap: Record<string, Member> = {};
        membersSnap.docs.forEach(doc => {
          membersMap[doc.id] = { id: doc.id, ...doc.data() } as Member;
        });

        // 2. スケジュール取得 (今日の分)
        // ※ 本来は startAt でフィルタしますが、デモ用に全件取得してJSでフィルタします
        const sSnap = await getDocs(query(collection(db, "schedules"), where("type", "==", "stream")));
        const today = new Date().toLocaleDateString();
        
        const data = sSnap.docs
          .map(doc => {
            const d = doc.data();
            return { id: doc.id, ...d } as Schedule;
          })
          .filter(s => {
            const sDate = s.startAt instanceof Timestamp ? s.startAt.toDate() : new Date(s.startAt);
            return sDate.toLocaleDateString() === today;
          })
          .map(s => ({
            ...s,
            member: membersMap[s.userId]
          }))
          .sort((a, b) => {
            const tA = a.startAt instanceof Timestamp ? a.startAt.toDate() : new Date(a.startAt);
            const tB = b.startAt instanceof Timestamp ? b.startAt.toDate() : new Date(b.startAt);
            return tA.getTime() - tB.getTime();
          });

        setSchedules(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
            {schedules.map((schedule) => {
              const startDate = schedule.startAt instanceof Timestamp ? schedule.startAt.toDate() : new Date(schedule.startAt);
              const isLive = new Date() >= startDate; // 簡易的なLive判定

              return (
                <div key={schedule.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-lg group">
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
            })}
          </div>

        </main>
      </div>
    </div>
  );
}