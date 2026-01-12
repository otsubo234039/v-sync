"use client";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { CalendarEvent } from "@/models/Schedule";

// --- 期間選択ボタン ---
export function DurationSplitButton({ onApply }: { onApply: (minutes: number) => void }) {
  const { themeMode } = useTheme();
  const [minutes, setMinutes] = useState(60);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const OPTIONS = [
    { label: "+30m", value: 30 }, { label: "+1h", value: 60 }, { label: "+1.5h", value: 90 },
    { label: "+2h", value: 120 }, { label: "+3h", value: 180 }, { label: "+4h", value: 240 },
    { label: "+5h", value: 300 }, { label: "+6h", value: 360 }, { label: "+8h", value: 480 },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (val: number) => {
    setMinutes(val);
    onApply(val);
    setIsOpen(false);
  };

  const currentLabel = minutes < 60 ? `+${minutes}m` : `+${minutes / 60}h`;
  const themeClass = themeMode === 'dark' ? "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700" : "bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200";

  return (
    <div className="relative h-[38px] flex items-center shadow-sm" ref={containerRef}>
      <button type="button" onClick={() => onApply(minutes)} className={`flex items-center justify-center font-bold text-xs transition border h-full focus:outline-none ${themeClass} rounded-l px-3 border-r-0 min-w-[50px]`}>{currentLabel}</button>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-center font-bold text-xs transition border h-full focus:outline-none ${themeClass} rounded-r px-1 border-l-0 w-6 hover:brightness-110`}><span className="text-[10px]">▼</span></button>
      {isOpen && (
        <div className={`absolute top-full right-0 mt-1 w-28 rounded-lg shadow-xl border overflow-hidden z-[100] max-h-48 overflow-y-auto custom-scrollbar ${themeMode === 'dark' ? 'bg-[#0F1515] border-slate-700' : 'bg-white border-slate-200'}`}>
          {OPTIONS.map((opt) => (
            <button key={opt.value} type="button" onClick={() => handleOptionClick(opt.value)} className={`w-full text-left px-3 py-2 text-xs font-bold transition ${minutes === opt.value ? (themeMode === 'dark' ? 'bg-brand/20 text-brand' : 'bg-brand/10 text-brand') : (themeMode === 'dark' ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50')}`}>{opt.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- 新規追加モーダル ---
export function AddEventModal({ initialDate, onClose, onAdd }: { initialDate?: Date, onClose: () => void, onAdd: (e: any) => void }) {
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
    // 簡易フォーマット
    const pad = (n: number) => String(n).padStart(2, '0');
    return { date: `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`, time: `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}` };
  };

  const handleStartAdd = (minutes: number) => { const res = addMinutesToTime(startDate, startTime, minutes); setStartDate(res.date); setStartTime(res.time); };
  const handleEndAdd = (minutes: number) => { const res = addMinutesToTime(endDate, endTime, minutes); setEndDate(res.date); setEndTime(res.time); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            <input type="text" required autoFocus className={inputClass} placeholder="タイトルを入力" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className={`space-y-4 p-4 rounded-lg border border-brand/20 ${themeMode === 'dark' ? 'bg-black/20' : 'bg-slate-50'}`}>
            <div className="relative z-20">
              <label className="block text-[10px] font-bold text-brand mb-1">START</label>
              <div className="flex items-end gap-3">
                <div className="flex gap-2 flex-1"><input type="date" required className={`flex-1 ${inputClass} text-sm`} value={startDate} onChange={e => setStartDate(e.target.value)} /><input type="text" required className={`${timeInputClass}`} value={startTime} onChange={e => setStartTime(e.target.value)} /></div>
                <div className="shrink-0"><DurationSplitButton onApply={handleStartAdd} /></div>
              </div>
            </div>
            <div className="relative z-10">
              <label className="block text-[10px] font-bold text-brand mb-1">END</label>
              <div className="flex items-end gap-3">
                <div className="flex gap-2 flex-1"><input type="date" required className={`flex-1 ${inputClass} text-sm`} value={endDate} onChange={e => setEndDate(e.target.value)} /><input type="text" required className={`${timeInputClass}`} value={endTime} onChange={e => setEndTime(e.target.value)} /></div>
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

// --- 詳細表示モーダル ---
export function EventDetailModal({ event, onClose, onDelete, isEditable }: { event: CalendarEvent, onClose: () => void, onDelete: () => void, isEditable: boolean }) {
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
            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${isStudio ? "bg-orange-900/30 border-orange-500/50 text-orange-500" : event.type === 'meeting' ? "bg-blue-900/30 border-blue-500/50 text-blue-500" : "bg-brand/20 border-brand/50 text-brand"}`}>{event.type}</span>
            <button onClick={onClose} className="text-slate-500 hover:text-brand transition text-xl">×</button>
          </div>
          <h2 className={`text-2xl font-bold mb-2 leading-snug ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>{event.title}</h2>
          <p className="text-brand font-mono text-sm mb-6 pb-4 border-b border-brand/20">{dateStr}</p>
          {isStudio && (
             <div className={`flex gap-4 p-3 rounded-lg border border-brand/20 ${themeMode === 'dark' ? 'bg-black/20' : 'bg-slate-50'}`}>
               <div className="text-2xl">🎙️</div>
               <div><p className="text-[10px] text-brand font-bold uppercase">FACILITY</p><p className={`font-bold ${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{event.originalData.resourceName}</p></div>
             </div>
          )}
          <div className="mt-8 flex justify-between items-center border-t border-brand/20 pt-4">
            {isEditable ? <button onClick={onDelete} className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1 transition">🗑️ Delete {isStudio ? "Booking" : "Event"}</button> : <span />}
            <button onClick={onClose} className="px-5 py-2 bg-brand hover:brightness-110 text-black rounded-lg font-bold text-sm transition shadow-lg">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}