// src/app/admin/schedule/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, Timestamp } from "firebase/firestore";
import { Schedule, Member } from "../../../types"; 
import NewScheduleModal from "@/components/admin/NewScheduleModal";

// 時間軸のメモリ（0時〜23時）
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function TimelinePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSchedules = useCallback(async () => {
    try {
      const q = query(collection(db, "schedules"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Schedule[];
      setSchedules(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchMembers = useCallback(async () => {
    try {
      const q = query(collection(db, "members"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Member[];
      setMembers(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
    fetchMembers();
  }, [fetchSchedules, fetchMembers]);

  const changeDate = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  const TOTAL_MINUTES = 1440;
  
  const getPositionStyle = (start: Timestamp, end: Timestamp) => {
    const startDate = start.toDate();
    const endDate = end.toDate();

    const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
    const leftPercent = (startMinutes / TOTAL_MINUTES) * 100;

    const durationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    const widthPercent = (durationMinutes / TOTAL_MINUTES) * 100;

    return { left: `${leftPercent}%`, width: `${widthPercent}%` };
  };

  const dateKey = currentDate.toLocaleDateString();

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentLinePosPercent = (currentMinutes / TOTAL_MINUTES) * 100;
  const isToday = now.toLocaleDateString() === dateKey;

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-200 font-sans relative overflow-hidden">
      
      {/* 背景 */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)'
          }}
        />
      </div>

      <div className="relative z-10 flex w-full h-full">
        <Sidebar />

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          
          {/* ヘッダー */}
          <header className="flex justify-between items-center p-6 shrink-0 bg-[#0F172A]/90 backdrop-blur z-20 border-b border-slate-700">
            <div>
              <h2 className="text-xs text-cyan-500 font-bold tracking-widest mb-1">TIMELINE VIEW</h2>
              <div className="flex items-center gap-4">
                <button onClick={() => changeDate(-1)} className="text-slate-400 hover:text-white transition">◀</button>
                <h1 className="text-2xl font-bold text-white tracking-tight min-w-[200px] text-center">
                  {currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                </h1>
                <button onClick={() => changeDate(1)} className="text-slate-400 hover:text-white transition">▶</button>
                {isToday && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded animate-pulse">TODAY</span>}
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)] transition"
            >
              + Add Schedule
            </button>
          </header>

          {/* タイムライン本体 */}
          <div className="flex-1 overflow-hidden relative bg-[#0F172A] flex flex-col">
            
            {/* 時間ヘッダー */}
            <div className="flex items-center border-b border-slate-700 bg-[#0F172A] z-10 h-10">
              <div className="w-[150px] shrink-0 border-r border-slate-700/50 h-full bg-[#0F172A]" />
              <div className="flex-1 relative h-full">
                {HOURS.map(h => (
                  <div 
                    key={h} 
                    className="absolute top-0 bottom-0 text-[10px] text-slate-500 border-l border-slate-700/50 pl-1 pt-2 font-mono" 
                    style={{ left: `${(h / 24) * 100}%` }}
                  >
                    {String(h).padStart(2, '0')}
                  </div>
                ))}
              </div>
            </div>

            {/* スクロールエリア */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              
              {/* 現在時刻の赤線 */}
              {isToday && (
                <div 
                  className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-30 pointer-events-none shadow-[0_0_10px_#ef4444]"
                  style={{ left: `calc(150px + ${currentLinePosPercent} * (100% - 150px) / 100)` }} 
                >
                  <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                </div>
              )}

              {/* メンバーがまだいない場合の表示 */}
              {members.length === 0 && (
                <div className="p-10 text-center text-slate-500 italic">
                  No members registered yet.
                </div>
              )}

              {/* メンバーごとのループ */}
              {members.map((member) => {
                const userSchedules = schedules.filter(s => {
                  const sDate = s.startAt instanceof Timestamp ? s.startAt.toDate() : new Date(s.startAt);
                  const isSameDate = sDate.toLocaleDateString() === dateKey;
                  return isSameDate && s.userId === member.id;
                });

                return (
                  <div key={member.id} className="flex border-b border-slate-700/30 hover:bg-slate-800/20 transition group h-[60px]">
                    
                    {/* 左端：メンバー情報 */}
                    <div className="w-[150px] shrink-0 bg-[#0F172A] border-r border-slate-700/50 z-10 flex items-center gap-3 p-3 group-hover:bg-[#1E293B] transition">
                      
                      {/* ★ここを修正：スタイル属性で背景色と光彩（shadow）を指定 */}
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ring-1 ring-white/20"
                        style={{ 
                          backgroundColor: member.color,
                          boxShadow: `0 0 10px ${member.color}80` // 50% opacityのshadow
                        }}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-300 truncate">{member.name}</span>
                    </div>

                    {/* 右側：バー表示エリア */}
                    <div className="flex-1 relative h-full">
                      {HOURS.map(h => (
                        <div 
                          key={h} 
                          className="absolute top-0 bottom-0 border-l border-slate-700/10"
                          style={{ left: `${(h / 24) * 100}%` }}
                        />
                      ))}

                      {userSchedules.map(schedule => {
                        const pos = getPositionStyle(schedule.startAt, schedule.endAt);
                        
                        let barColor = "bg-slate-600 border-slate-500";
                        if (schedule.type === "stream") barColor = "bg-red-500/80 border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]";
                        if (schedule.type === "meeting") barColor = "bg-blue-500/80 border-blue-400";
                        if (schedule.type === "event") barColor = "bg-yellow-500/80 border-yellow-400";

                        return (
                          <div
                            key={schedule.id}
                            className={`absolute top-2 bottom-2 rounded border ${barColor} text-white text-[10px] px-2 flex items-center overflow-hidden whitespace-nowrap cursor-pointer hover:brightness-110 hover:z-20 z-10`}
                            style={pos}
                            title={`${schedule.title} (${schedule.type})`}
                          >
                            <span className="font-bold drop-shadow-md truncate">{schedule.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      <NewScheduleModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdded={fetchSchedules} 
      />
    </div>
  );
}