"use client";
import { StaffTask } from "@/models/Task";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  title: string;
  count: number;
  color: string; // Tailwind class for dot color
  tasks: StaffTask[];
  onDelete: (id: string) => void;
};

export default function TaskColumn({ title, count, color, tasks, onDelete }: Props) {
  const { themeMode } = useTheme();

  return (
    <div className={`flex flex-col border border-brand/20 rounded-2xl overflow-hidden h-full shadow-lg backdrop-blur-sm min-h-0
      ${themeMode === 'dark' ? 'bg-brand-dim/30' : 'bg-white/60'}`}
    >
      <div className={`p-4 border-b border-brand/20 flex justify-between items-center shrink-0 
        ${themeMode === 'dark' ? 'bg-brand-dim/50' : 'bg-brand/5'}`}
      >
        <h3 className={`font-bold flex items-center gap-2 text-xs uppercase tracking-widest ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>
          <span className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_currentColor]`}></span>{title}
        </h3>
        <span className={`text-[10px] px-2 py-0.5 rounded-full text-brand border border-brand/30 font-mono ${themeMode === 'dark' ? 'bg-black' : 'bg-white'}`}>
          {count}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {tasks.map(t => (
          <div key={t.id} className={`group relative p-4 rounded-xl border border-brand/20 hover:border-brand/60 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer
            ${themeMode === 'dark' ? 'bg-[#0A1010]' : 'bg-white'}`}
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${t.priority === 'high' ? 'bg-red-500' : t.priority === 'medium' ? 'bg-yellow-500' : 'bg-brand'}`} />
            
            <div className="flex justify-between items-start mb-2 pl-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border 
                ${t.priority === 'high' ? 'text-red-500 border-red-500/30 bg-red-500/10' : t.priority === 'medium' ? 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10' : 'text-brand border-brand/30 bg-brand/10'}`}>
                {t.priority}
              </span>
              <button onClick={(e) => {e.stopPropagation(); onDelete(t.id)}} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>
            </div>
            
            <h4 className={`text-sm font-bold pl-2 mb-3 leading-snug ${themeMode === 'dark' ? 'text-white' : 'text-slate-800'}`}>{t.title}</h4>
            
            <div className="pl-2 flex items-center gap-1 text-[10px] text-slate-400">
              👤 <span className={`${themeMode === 'dark' ? 'text-slate-200' : 'text-slate-600'} font-bold`}>{t.assignee || "Unassigned"}</span>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="h-24 flex items-center justify-center text-brand/30 text-xs italic border-2 border-dashed border-brand/10 rounded-xl">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}