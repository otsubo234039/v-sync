"use client";
import { useTheme } from "@/context/ThemeContext";
import { CalendarEvent } from "@/models/Schedule";

type Props = {
  day: Date;
  currentMonth: Date;
  events: CalendarEvent[];
  isToday: boolean;
  onEventClick: (e: CalendarEvent) => void;
  onDateClick: (d: Date) => void;
  isEditable: boolean;
};

export default function CalendarDay({ day, currentMonth, events, isToday, onEventClick, onDateClick, isEditable }: Props) {
  const { themeMode } = useTheme();
  const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
  const dayStart = new Date(day); dayStart.setHours(0,0,0,0);
  const dayEnd = new Date(day); dayEnd.setHours(23,59,59,999);
  
  // その日のイベントを抽出
  const dayEvents = events.filter((e) => e.startAt <= dayEnd && e.endAt >= dayStart).sort((a, b) => a.startAt.getTime() - b.startAt.getTime());

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
        {dayEvents.map((event, i) => (
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