"use client";
import NewBookingModal from "@/components/admin/NewBookingModal";
import BookingTimelineRow from "@/components/admin/booking/BookingTimelineRow";
import { useAdminBooking } from "@/hooks/useAdminBooking";
import { RESOURCES } from "@/models/Booking";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function BookingPage() {
  const { currentDate, bookings, isModalOpen, setIsModalOpen, fetchBookings, changeDate, addDemoBookings } = useAdminBooking();

  const TOTAL_MINUTES = 1440;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentLinePosPercent = (currentMinutes / TOTAL_MINUTES) * 100;
  const dateKey = currentDate.toLocaleDateString();
  const isToday = now.toLocaleDateString() === dateKey;

  // ★修正: 外側のLayoutラッパーやSidebarコンポーネントを削除
  return (
    <div className="flex flex-col h-full overflow-hidden p-6">
      <header className="flex justify-between items-center mb-6 shrink-0">
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
          <button onClick={addDemoBookings} className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-4 py-2 rounded-lg font-bold transition text-xs border border-slate-200 dark:border-slate-700">🧪 Demo</button>
          <button onClick={() => setIsModalOpen(true)} className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition">+ Reserve</button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden relative bg-white dark:bg-[#0b111e] flex flex-col rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0b111e] z-10 h-10">
          <div className="w-[180px] shrink-0 border-r border-slate-200 dark:border-slate-800 h-full" />
          <div className="flex-1 relative h-full">
            {HOURS.map(h => (
              <div key={h} className="absolute top-0 bottom-0 text-[10px] text-slate-400 border-l border-slate-200 dark:border-slate-800 pl-1 pt-2 font-mono" style={{ left: `${(h / 24) * 100}%` }}>
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
          {bookings.length === 0 && <div className="p-10 text-center text-slate-500 text-xs italic">No bookings yet.</div>}
          {RESOURCES.map((resource) => (
            <BookingTimelineRow key={resource.id} resource={resource} bookings={bookings} dateKey={dateKey} HOURS={HOURS} />
          ))}
        </div>
      </div>
      <NewBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdded={fetchBookings} />
    </div>
  );
}