"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, Timestamp, addDoc, deleteDoc, doc } from "firebase/firestore";
import StaffSidebar from "@/components/staff/StaffSidebar";
// import { Schedule, Booking } from "../../../types"; // 型定義は使うが、doc.data()のキャストではanyを使う
import { useTheme } from "@/context/ThemeContext";

// 型定義
type CalendarEvent = {
  id: string;
  title: string;
  type: 'studio' | 'meeting' | 'event';
  startAt: Date;
  endAt: Date;
  originalData: any;
};

// 期間選択スプリットボタン
function DurationSplitButton({ onApply }: { onApply: (minutes: number) => void }) {
  const { themeMode } = useTheme();
  const [minutes, setMinutes] = useState(60);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const OPTIONS = [
    { label: "+30m", value: 30 },
    { label: "+1h", value: 60 },
    { label: "+1.5h", value: 90 },
    { label: "+2h", value: 120 },
    { label: "+3h", value: 180 },
    { label: "+4h", value: 240 },
    { label: "+5h", value: 300 },
    { label: "+6h", value: 360 },
    { label: "+8h", value: 480 },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMainClick = () => {
    onApply(minutes);
  };

  const handleOptionClick = (val: number) => {
    setMinutes(val);
    onApply(val);
    setIsOpen(false);
  };

  const currentLabel = minutes < 60 ? `+${minutes}m` : `+${minutes / 60}h`;

  const baseClass = `flex items-center justify-center font-bold text-xs transition border h-full focus:outline-none relative`;
  const themeClass = themeMode === 'dark' 
    ? "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700" 
    : "bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200";

  return (
    <div className="relative h-[38px] flex items-center shadow-sm" ref={containerRef}>
      <button 
        type="button"
        onClick={handleMainClick}
        className={`${baseClass} ${themeClass} rounded-l px-3 border-r-0 min-w-[50px]`}
        title="Add duration"
      >
        {currentLabel}
      </button>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${baseClass} ${themeClass} rounded-r px-1 border-l-0 w-6 hover:brightness-110`}
      >
        <span className="text-[10px]">▼</span>
      </button>
      {isOpen && (
        <div className={`absolute top-full right-0 mt-1 w-28 rounded-lg shadow-xl border overflow-hidden z-[100] max-h-48 overflow-y-auto custom-scrollbar
          ${themeMode === 'dark' ? 'bg-[#0F1515] border-slate-700' : 'bg-white border-slate-200'}
        `}>
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleOptionClick(opt.value)}
              className={`w-full text-left px-3 py-2 text-xs font-bold transition
                ${minutes === opt.value 
                  ? (themeMode === 'dark' ? 'bg-brand/20 text-brand' : 'bg-brand/10 text-brand') 
                  : (themeMode === 'dark' ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50')}
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 新規追加モーダル
function AddEventModal({ initialDate, onClose, onAdd }: { initialDate?: Date, onClose: () => void, onAdd: (e: any) => void }) {
  const { themeMode } = useTheme();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<'meeting' | 'event'>("meeting");

  const defaultStart = initialDate ? new Date(initialDate) : new Date();
  defaultStart.setHours(10, 0, 0, 0);
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setHours(11, 0, 0, 0);

  const [startDate, setStartDate] = useState(defaultStart.toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(defaultStart.toTimeString().slice(0, 5));
  const [endDate, setEndDate] = useState(defaultEnd.toISOString().split('T')[0]);
  const [endTime, setEndTime] = useState(defaultEnd.toTimeString().slice(0, 5));

  const addMinutesToTime = (dateStr: string, timeStr: string, minutes: number) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const [h, min] = timeStr.split(':').map(Number);
    const dateObj = new Date(y, m - 1, d, h, min); 
    dateObj.setMinutes(dateObj.getMinutes() + minutes);
    const newY = dateObj.getFullYear();
    const newM = String(dateObj.getMonth() + 1).padStart(2, '0');
    const newD = String(dateObj.getDate()).padStart(2, '0');
    const newH = String(dateObj.getHours()).padStart(2, '0');
    const newMin = String(dateObj.getMinutes()).padStart(2, '0');
    return { date: `${newY}-${newM}-${newD}`, time: `${newH}:${newMin}` };
  };

  const handleStartAdd = (minutes: number) => {
    const res = addMinutesToTime(startDate, startTime, minutes);
    if (res) { setStartDate(res.date); setStartTime(res.time); }
  };

  const handleEndAdd = (minutes: number) => {
    const res = addMinutesToTime(endDate, endTime, minutes);
    if (res) { setEndDate(res.date); setEndTime(res.time); }
  };

  const formatTime = (val: string, setter: (s: string) => void) => {
    let clean = val.replace(/[^0-9:]/g, "");
    if (!clean) return;
    if (clean.match(/^[0-9]{4}$/)) clean = clean.slice(0, 2) + ":" + clean.slice(2);
    else if (clean.match(/^[0-9]{3}$/)) clean = "0" + clean.slice(0, 1) + ":" + clean.slice(1);
    else if (clean.match(/^[0-9]{2}$/)) clean = clean + ":00";
    else if (clean.match(/^[0-9]{1}$/)) clean = "0" + clean + ":00";
    if (clean.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      const parts = clean.split(":");
      setter(`${parts[0].padStart(2, "0")}:${parts[1]}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime.includes(":") || !endTime.includes(":")) { alert("時間を正しい形式(HH:MM)で入力してください"); return; }
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    if (end <= start) { alert("終了日時は開始日時より後に設定してください"); return; }
    onAdd({ title, type, startAt: start, endAt: end });
  };

  const inputClass = `w-full border rounded p-3 outline-none focus:border-brand transition h-[38px] ${themeMode === 'dark' ? 'bg-black/50 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`;
  const timeInputClass = `w-20 border rounded p-2 text-center outline-none focus:border-brand transition font-mono h-[38px] ${themeMode === 'dark' ? 'bg-black/50 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className={`border border-brand/30 w-full max-w-md rounded-2xl shadow-2xl p-6 ${themeMode === 'dark' ? 'bg-[#0A1010]' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
        <h2 className={`text-xl font-bold mb-6 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Add Schedule</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">TYPE</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setType("meeting")} className={`flex-1 py-2 rounded border text-xs font-bold transition ${type === "meeting" ? "bg-blue-600 border-blue-400 text-white" : "border-slate-500 text-slate-400"}`}>🏢 MEETING</button>
              <button type="button" onClick={() => setType("event")} className={`flex-1 py-2 rounded border text-xs font-bold transition ${type === "event" ? "bg-brand border-brand text-black" : "border-slate-500 text-slate-400"}`}>🚩 EVENT</button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">TITLE</label>
            <input type="text" required autoFocus className={inputClass} placeholder="企画会議, 長期イベント etc." value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className={`space-y-4 p-4 rounded-lg border border-brand/20 ${themeMode === 'dark' ? 'bg-black/20' : 'bg-slate-50'}`}>
            <div className="relative z-20">
              <label className="block text-[10px] font-bold text-brand mb-1">START</label>
              <div className="flex items-end gap-3">
                <div className="flex gap-2 flex-1">
                  <input type="date" required className={`flex-1 ${inputClass} text-sm`} value={startDate} onChange={e => setStartDate(e.target.value)} />
                  <input type="text" required className={`${timeInputClass}`} placeholder="10:00" maxLength={5} value={startTime} onChange={e => setStartTime(e.target.value)} onBlur={(e) => formatTime(e.target.value, setStartTime)} />
                </div>
                <div className="shrink-0"><DurationSplitButton onApply={handleStartAdd} /></div>
              </div>
            </div>
            <div className="flex justify-center text-slate-400 text-xs opacity-50">⬇</div>
            <div className="relative z-10">
              <label className="block text-[10px] font-bold text-brand mb-1">END</label>
              <div className="flex items-end gap-3">
                <div className="flex gap-2 flex-1">
                  <input type="date" required className={`flex-1 ${inputClass} text-sm`} value={endDate} onChange={e => setEndDate(e.target.value)} />
                  <input type="text" required className={`${timeInputClass}`} placeholder="11:00" maxLength={5} value={endTime} onChange={e => setEndTime(e.target.value)} onBlur={(e) => formatTime(e.target.value, setEndTime)} />
                </div>
                <div className="shrink-0"><DurationSplitButton onApply={handleEndAdd} /></div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-brand text-xs font-bold">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-brand hover:brightness-110 text-black rounded-lg font-bold text-sm shadow-lg transition">Save Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 詳細表示モーダル
function EventDetailModal({ event, onClose, onDelete, isEditable }: { event: CalendarEvent, onClose: () => void, onDelete: () => void, isEditable: boolean }) {
  const { themeMode } = useTheme();
  if (!event) return null;
  const isStudio = event.type === 'studio';
  const headerColor = isStudio ? "bg-orange-500" : event.type === 'meeting' ? "bg-blue-500" : "bg-brand";
  const dateStr = `${event.startAt.toLocaleDateString()} ${event.startAt.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - ${event.endAt.toLocaleDateString()} ${event.endAt.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className={`border border-brand/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200 ${themeMode === 'dark' ? 'bg-[#0A1010]' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
        <div className={`h-2 w-full ${headerColor}`} />
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border 
                ${isStudio ? "bg-orange-900/30 border-orange-500/50 text-orange-500" 
                  : event.type === 'meeting' ? "bg-blue-900/30 border-blue-500/50 text-blue-500" 
                  : "bg-brand/20 border-brand/50 text-brand"}`}>
                {event.type}
              </span>
            </div>
            <button onClick={onClose} className="text-slate-500 hover:text-brand transition text-xl">×</button>
          </div>
          <h2 className={`text-2xl font-bold mb-2 leading-snug ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{event.title}</h2>
          <p className="text-brand font-mono text-sm mb-6 pb-4 border-b border-brand/20">{dateStr}</p>
          <div className="space-y-6">
            {isStudio && (
              <>
                <div className={`flex gap-4 p-3 rounded-lg border border-brand/20 ${themeMode === 'dark' ? 'bg-black/20' : 'bg-slate-50'}`}>
                  <div className="text-2xl">🎙️</div>
                  <div>
                    <p className="text-[10px] text-brand font-bold uppercase">FACILITY</p>
                    <p className={`font-bold ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{event.originalData.resourceName}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="mt-8 flex justify-between items-center border-t border-brand/20 pt-4">
            {isEditable ? (
              <button onClick={onDelete} className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1 transition">🗑️ Delete {isStudio ? "Booking" : "Event"}</button>
            ) : <span />}
            <button onClick={onClose} className="px-5 py-2 bg-brand hover:brightness-110 text-black rounded-lg font-bold text-sm transition shadow-lg">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// カレンダーセル
function CalendarDay({ day, currentMonth, events, isToday, onEventClick, onDateClick, isEditable }: any) {
  const { themeMode } = useTheme();
  const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
  const dayStart = new Date(day); dayStart.setHours(0,0,0,0);
  const dayEnd = new Date(day); dayEnd.setHours(23,59,59,999);
  const dayEvents = events.filter((e: CalendarEvent) => e.startAt <= dayEnd && e.endAt >= dayStart).sort((a: CalendarEvent, b: CalendarEvent) => a.startAt.getTime() - b.startAt.getTime());

  return (
    <div 
      onClick={() => isEditable && onDateClick(day)}
      className={`h-full flex flex-col border-b border-r border-brand/20 p-1.5 transition-colors overflow-hidden group relative
      ${isCurrentMonth ? (themeMode === 'dark' ? "bg-brand-dim/30 hover:bg-brand/10" : "bg-white/40 hover:bg-white/80") : (themeMode === 'dark' ? "bg-black/40 text-slate-700" : "bg-slate-100/50 text-slate-400")}
      ${isToday ? "bg-brand/10" : ""} ${isEditable ? "cursor-pointer" : ""}`}>
      <div className="flex justify-between items-start mb-1 shrink-0">
        <span className={`text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-brand text-black shadow-[0_0_10px_rgba(var(--brand-rgb),0.5)]" : isCurrentMonth ? (themeMode === 'dark' ? "text-slate-300" : "text-slate-600") : "text-slate-500"}`}>{day.getDate()}</span>
        {isEditable && isCurrentMonth && <span className="opacity-0 group-hover:opacity-100 text-brand text-xs font-bold transition-opacity">＋</span>}
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
        {dayEvents.map((event: CalendarEvent, i: number) => (
          <div key={i} onClick={(e) => { e.stopPropagation(); onEventClick(event); }} 
            className={`text-[10px] px-1.5 py-0.5 rounded truncate font-bold border-l-2 cursor-pointer hover:brightness-110 hover:scale-[1.02] transition-all shrink-0 shadow-sm
              ${event.type === 'studio' ? "bg-orange-900/40 text-orange-200 border-orange-500" : event.type === 'meeting' ? "bg-blue-900/40 text-blue-200 border-blue-500" : "bg-brand/20 text-brand-glow border-brand text-white"}
              ${themeMode === 'light' && event.type === 'event' ? "text-slate-800 font-extrabold" : ""}`}
            style={event.type === 'event' ? { borderColor: 'var(--brand-color)', backgroundColor: 'rgba(var(--brand-rgb), 0.2)' } : {}}>
            {event.type === 'studio' ? '🎙️' : event.type === 'meeting' ? '🏢' : '🚩'} {event.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StaffSchedulePage() {
  const { user, loading } = useAuth();
  const { backgroundStyle, baseTextColor, themeMode } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [initialDateForModal, setInitialDateForModal] = useState<Date | undefined>(undefined);
  const isEditable = true; 

  const fetchData = useCallback(async () => {
    try {
      const allEvents: CalendarEvent[] = [];
      const bookingsSnap = await getDocs(query(collection(db, "bookings")));
      // ★ 修正: doc.data() as any で型エラー回避
      bookingsSnap.forEach(doc => {
        const d = doc.data() as any;
        const start = d.startAt instanceof Timestamp ? d.startAt.toDate() : new Date(d.startAt);
        const end = d.endAt instanceof Timestamp ? d.endAt.toDate() : new Date(d.endAt);
        allEvents.push({ id: doc.id, title: `${d.resourceName} (${d.applicantName})`, type: 'studio', startAt: start, endAt: end, originalData: d });
      });

      const schedulesSnap = await getDocs(query(collection(db, "schedules")));
      // ★ 修正: doc.data() as any で型エラー回避
      schedulesSnap.forEach(doc => {
        const d = doc.data() as any;
        if (d.type === 'stream') return;
        const start = d.startAt instanceof Timestamp ? d.startAt.toDate() : new Date(d.startAt);
        const end = d.endAt instanceof Timestamp ? d.endAt.toDate() : new Date(d.endAt);
        allEvents.push({ id: doc.id, title: d.title, type: d.type === 'meeting' ? 'meeting' : 'event', startAt: start, endAt: end, originalData: d });
      });
      setEvents(allEvents);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddSchedule = async (data: { title: string, type: string, startAt: Date, endAt: Date }) => {
    try {
      await addDoc(collection(db, "schedules"), { userId: "staff", title: data.title, type: data.type, startAt: Timestamp.fromDate(data.startAt), endAt: Timestamp.fromDate(data.endAt), createdAt: Timestamp.now() });
      setIsAddModalOpen(false);
      fetchData();
    } catch (e) { console.error(e); alert("追加に失敗しました"); }
  };

  const handleDeleteSchedule = async () => {
    if (!selectedEvent || !confirm(`「${selectedEvent.title}」を削除しますか？`)) return;
    try {
      const collectionName = selectedEvent.type === 'studio' ? 'bookings' : 'schedules';
      await deleteDoc(doc(db, collectionName, selectedEvent.id));
      setSelectedEvent(null);
      fetchData();
    } catch (e) { console.error(e); alert("削除に失敗しました"); }
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const start = new Date(firstDay); start.setDate(start.getDate() - start.getDay()); 
    const end = new Date(lastDay); end.setDate(end.getDate() + (6 - end.getDay()));
    const days = [];
    let d = new Date(start);
    while (d <= end) { days.push(new Date(d)); d.setDate(d.getDate() + 1); }
    return days;
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate); newDate.setMonth(newDate.getMonth() + offset); setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date) => { setInitialDateForModal(date); setIsAddModalOpen(true); };
  const handleHeaderAddClick = () => { setInitialDateForModal(undefined); setIsAddModalOpen(true); };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand">LOADING...</div>;

  const days = getCalendarDays();
  const todayKey = new Date().toLocaleDateString();

  return (
    <div className={`flex h-screen w-screen font-sans relative overflow-hidden transition-colors duration-300 ${baseTextColor}`} style={backgroundStyle}>
      <div className="relative z-10 flex w-full h-full"> 
        <StaffSidebar />
        <main className="flex-1 p-6 h-full flex flex-col overflow-hidden">
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
          <div className={`flex-1 border border-brand/20 rounded-2xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm min-h-0 ${themeMode === 'dark' ? 'bg-brand-dim/20' : 'bg-white/60'}`}>
            <div className={`grid grid-cols-7 border-b border-brand/20 shrink-0 ${themeMode === 'dark' ? 'bg-brand-dim/50' : 'bg-white/80'}`}>
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => <div key={d} className="py-2 text-center text-[10px] font-bold text-brand tracking-wider">{d}</div>)}
            </div>
            <div className="flex-1 grid grid-cols-7 grid-rows-6 min-h-0">
              {days.map((day, i) => <CalendarDay key={i} day={day} currentMonth={currentDate} events={events} isToday={day.toLocaleDateString() === todayKey} onEventClick={setSelectedEvent} onDateClick={handleDateClick} isEditable={isEditable} />)}
            </div>
          </div>
        </main>
      </div>
      {selectedEvent && <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} onDelete={handleDeleteSchedule} isEditable={isEditable} />}
      {isAddModalOpen && <AddEventModal initialDate={initialDateForModal} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddSchedule} />}
    </div>
  );
}