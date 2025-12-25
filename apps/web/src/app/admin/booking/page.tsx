// src/app/admin/booking/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, Timestamp, writeBatch, doc } from "firebase/firestore"; // writeBatch, doc 追加
import { Booking } from "../../../types";
import NewBookingModal, { RESOURCES } from "@/components/admin/NewBookingModal";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function BookingPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const q = query(collection(db, "bookings"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];
      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // ■ デモデータ投入用関数
  const addDemoBookings = async () => {
    if(!confirm("今日のデモ予約データを追加しますか？")) return;
    
    try {
      const batch = writeBatch(db);
      const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      // デモデータ定義
      const demos = [
        { 
          resourceId: "studio_a", resourceName: "Studio A (3D Live)", 
          applicantName: "月ノ美兎", purpose: "3Dライブ リハーサル", 
          start: "10:00", end: "13:00" 
        },
        { 
          resourceId: "studio_a", resourceName: "Studio A (3D Live)", 
          applicantName: "剣持刀也", purpose: "新衣装3Dお披露目", 
          start: "15:00", end: "17:00" 
        },
        { 
          resourceId: "studio_b", resourceName: "Studio B (Recording)", 
          applicantName: "葛葉", purpose: "歌ってみた収録", 
          start: "13:00", end: "16:00" 
        },
        { 
          resourceId: "booth", resourceName: "Vocal Booth", 
          applicantName: "叶", purpose: "ボイス収録", 
          start: "11:00", end: "12:00" 
        },
        { 
          resourceId: "mocap_suit", resourceName: "Mocap Suit X", 
          applicantName: "運営スタッフ", purpose: "機材メンテナンス", 
          start: "09:00", end: "10:30" 
        },
      ];

      demos.forEach(d => {
        const newRef = doc(collection(db, "bookings"));
        const startDt = new Date(`${todayStr}T${d.start}`);
        const endDt = new Date(`${todayStr}T${d.end}`);

        batch.set(newRef, {
          resourceId: d.resourceId,
          resourceName: d.resourceName,
          applicantName: d.applicantName,
          purpose: d.purpose,
          startAt: Timestamp.fromDate(startDt),
          endAt: Timestamp.fromDate(endDt),
          status: "confirmed",
          createdAt: Timestamp.now(),
        });
      });

      await batch.commit();
      fetchBookings(); // 画面更新
      alert("デモ予約を追加しました！");
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const changeDate = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  // タイムライン計算ロジック
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
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 font-sans relative overflow-hidden transition-colors">
      
      {/* 背景パターン */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)'
          }}
        />
      </div>

      <div className="relative z-10 flex w-full h-full">
        <Sidebar />

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          
          <header className="flex justify-between items-center p-6 shrink-0 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur z-20 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-xs text-orange-500 font-bold tracking-widest mb-1">FACILITY BOOKING</h2>
              <div className="flex items-center gap-4">
                <button onClick={() => changeDate(-1)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition">◀</button>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight min-w-[200px] text-center">
                  {currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                </h1>
                <button onClick={() => changeDate(1)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition">▶</button>
                {isToday && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded animate-pulse">TODAY</span>}
              </div>
            </div>
            
            <div className="flex gap-2">
              {/* ★デモボタン */}
              <button 
                onClick={addDemoBookings}
                className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-full font-bold transition text-xs"
              >
                🧪 Demo
              </button>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-2 rounded-full font-bold shadow-lg transition"
              >
                + Reserve
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-[#0F172A] flex flex-col transition-colors">
            
            {/* Time Header */}
            <div className="flex items-center border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] z-10 h-10 transition-colors">
              <div className="w-[180px] shrink-0 border-r border-slate-200 dark:border-slate-700/50 h-full bg-slate-50 dark:bg-[#0F172A]" />
              <div className="flex-1 relative h-full">
                {HOURS.map(h => (
                  <div key={h} className="absolute top-0 bottom-0 text-[10px] text-slate-400 dark:text-slate-500 border-l border-slate-200 dark:border-slate-700/50 pl-1 pt-2 font-mono" style={{ left: `${(h / 24) * 100}%` }}>
                    {String(h).padStart(2, '0')}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              
              {isToday && (
                <div className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-30 pointer-events-none shadow-[0_0_10px_#ef4444]" style={{ left: `calc(180px + ${currentLinePosPercent} * (100% - 180px) / 100)` }}>
                  <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                </div>
              )}

              {/* リソースごとのタイムライン */}
              {RESOURCES.map((resource) => {
                const resourceBookings = bookings.filter(b => {
                  const sDate = b.startAt instanceof Timestamp ? b.startAt.toDate() : new Date(b.startAt);
                  return sDate.toLocaleDateString() === dateKey && b.resourceId === resource.id;
                });

                return (
                  <div key={resource.id} className="flex border-b border-slate-200/50 dark:border-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-800/20 transition group h-[80px]">
                    
                    {/* 左側：リソース情報 */}
                    <div className="w-[180px] shrink-0 bg-slate-50 dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-700/50 z-10 flex flex-col justify-center px-4 group-hover:bg-slate-100 dark:group-hover:bg-[#1E293B] transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {resource.type === 'studio' ? '🎙️' : '🕶️'}
                        </span>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">
                          {resource.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">{resource.type}</span>
                    </div>

                    {/* 右側：予約バー */}
                    <div className="flex-1 relative h-full">
                      {HOURS.map(h => <div key={h} className="absolute top-0 bottom-0 border-l border-slate-200/50 dark:border-slate-700/10" style={{ left: `${(h / 24) * 100}%` }} />)}

                      {resourceBookings.map(booking => {
                        const pos = getPositionStyle(booking.startAt, booking.endAt);
                        
                        return (
                          <div
                            key={booking.id}
                            className="absolute top-3 bottom-3 rounded-md bg-orange-500/80 dark:bg-orange-600/60 border border-orange-400 dark:border-orange-500/50 text-white text-xs px-2 flex flex-col justify-center overflow-hidden cursor-pointer hover:brightness-110 hover:z-20 z-10 shadow-sm"
                            style={pos}
                            title={`${booking.purpose} by ${booking.applicantName}`}
                          >
                            <span className="font-bold truncate">{booking.applicantName}</span>
                            <span className="text-[10px] opacity-80 truncate">{booking.purpose}</span>
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

      <NewBookingModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdded={fetchBookings} 
      />
    </div>
  );
}