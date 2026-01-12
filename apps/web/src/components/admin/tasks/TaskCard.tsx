"use client";
import { AdminTask } from "@/models/AdminTask";

type Props = {
  task: AdminTask;
  onClick: () => void;
};

export default function TaskCard({ task, onClick }: Props) {
  const p = {
    high: { color: 'text-red-500 dark:text-red-400 border-red-500/30 bg-red-50 dark:bg-red-500/10', icon: '🔥' },
    medium: { color: 'text-yellow-600 dark:text-yellow-400 border-yellow-500/30 bg-yellow-50 dark:bg-yellow-500/10', icon: '⚡' },
    low: { color: 'text-green-600 dark:text-green-400 border-green-500/30 bg-green-50 dark:bg-green-500/10', icon: '🌱' },
  }[task.priority];

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500/50 hover:shadow-md transition cursor-pointer group shadow-sm relative overflow-hidden"
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
      
      <div className="flex justify-between items-start mb-2 pl-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${p.color} flex items-center gap-1`}>
          {p.icon} {task.priority.toUpperCase()}
        </span>
        {task.deadline && (
          <span className="text-[10px] text-slate-500 font-mono">
             {new Date(task.deadline.seconds * 1000).toLocaleDateString()}
          </span>
        )}
      </div>
      
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition pl-2 mb-1 leading-snug">{task.title}</h4>
      
      <div className="pl-2 mt-3 flex items-center justify-between text-[10px] text-slate-500">
        <span>ID: {task.id.slice(0, 4)}</span>
      </div>
    </div>
  );
}