"use client";
import Sidebar from "@/components/admin/Sidebar";
import NewBookingModal from "@/components/admin/NewBookingModal";
import BookingTimelineRow from "@/components/admin/booking/BookingTimelineRow";
import { useAdminBooking } from "@/hooks/useAdminBooking";
import { RESOURCES } from "@/models/Booking";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function BookingPage() {
  const {
    currentDate,
    bookings,
    isModalOpen,
    setIsModalOpen,
    fetchBookings,
    changeDate,
    addDemoBookings
  } = useAdminBooking();

  // 現在時刻線の位置計算
  const TOTAL_MINUTES = 1440;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentLinePosPercent = (currentMinutes / TOTAL_MINUTES) * 100;
  const dateKey = currentDate.toLocaleDateString();
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
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)'
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
              
              {/* 現在時刻線 */}
              {isToday && (
                <div className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-30 pointer-events-none shadow-[0_0_10px_#ef4444]" style={{ left: `calc(180px + ${currentLinePosPercent} * (100% - 180px) / 100)` }}>
                  <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
                </div>
              )}

              {/* リソースごとのタイムライン行 */}
              {RESOURCES.map((resource) => (
                <BookingTimelineRow 
                  key={resource.id}
                  resource={resource}
                  bookings={bookings}
                  dateKey={dateKey}
                  HOURS={HOURS}
                />
              ))}
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