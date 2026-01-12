"use client";
import StaffSidebar from "@/components/staff/StaffSidebar";
import CalendarDay from "@/components/staff/schedule/CalendarDay";
import { AddEventModal, EventDetailModal } from "@/components/staff/schedule/ScheduleModals";
import { useStaffSchedule } from "@/hooks/useStaffSchedule";

export default function StaffSchedulePage() {
  const {
    loading,
    backgroundStyle,
    baseTextColor,
    themeMode,
    currentDate,
    changeMonth,
    handleHeaderAddClick,
    getCalendarDays,
    events,
    selectedEvent, setSelectedEvent,
    isAddModalOpen, setIsAddModalOpen,
    initialDateForModal,
    handleDateClick,
    isEditable,
    handleAddSchedule,
    handleDeleteSchedule
  } = useStaffSchedule();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand">LOADING...</div>;

  const days = getCalendarDays();
  const todayKey = new Date().toLocaleDateString();

  return (
    <div className={`flex h-screen w-screen font-sans relative overflow-hidden transition-colors duration-300 ${baseTextColor}`} style={backgroundStyle}>
      <div className="relative z-10 flex w-full h-full"> 
        <StaffSidebar />
        
        <main className="flex-1 p-6 h-full flex flex-col overflow-hidden">
          
          {/* ヘッダー */}
          <header className="flex justify-between items-center mb-6 shrink-0">
            <div>
              <h2 className="text-xs text-brand font-bold tracking-widest mb-1">STAFF CONSOLE</h2>
              <div className="flex items-center gap-4">
                <button onClick={() => changeMonth(-1)} className="text-slate-400 hover:text-brand transition text-xl">◀</button>
                <h1 className={`text-3xl font-bold tracking-tight drop-shadow-[0_0_10px_rgba(var(--brand-rgb),0.3)] w-[200px] text-center ${themeMode === 'dark' ? 'text-white' : 'text-brand'}`}>
                  {currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }).toUpperCase()}
                </h1>
                <button onClick={() => changeMonth(1)} className="text-slate-400 hover:text-brand transition text-xl">▶</button>
              </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-orange-500"></span> STUDIO</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-blue-500"></span> OFFICE</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-brand"></span> EVENT</div>
              </div>
              <button onClick={handleHeaderAddClick} className="bg-brand hover:brightness-110 text-black px-4 py-2 rounded-lg font-bold shadow-lg transition text-sm flex items-center gap-2">+ Add Schedule</button>
            </div>
          </header>

          {/* カレンダーグリッド */}
          <div className={`flex-1 border border-brand/20 rounded-2xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm min-h-0 ${themeMode === 'dark' ? 'bg-brand-dim/20' : 'bg-white/60'}`}>
            <div className={`grid grid-cols-7 border-b border-brand/20 shrink-0 ${themeMode === 'dark' ? 'bg-brand-dim/50' : 'bg-white/80'}`}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => <div key={d} className="py-2 text-center text-[10px] font-bold text-brand tracking-wider">{d}</div>)}
            </div>
            <div className="flex-1 grid grid-cols-7 grid-rows-6 min-h-0">
              {days.map((day, i) => (
                <CalendarDay 
                  key={i} 
                  day={day} 
                  currentMonth={currentDate} 
                  events={events} 
                  isToday={day.toLocaleDateString() === todayKey} 
                  onEventClick={setSelectedEvent} 
                  onDateClick={handleDateClick} 
                  isEditable={isEditable} 
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* モーダル群 */}
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onDelete={handleDeleteSchedule} isEditable={isEditable} />}
      {isAddModalOpen && <AddEventModal initialDate={initialDateForModal} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddSchedule} />}
    </div>
  );
}