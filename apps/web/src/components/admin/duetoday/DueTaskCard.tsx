"use client";
import { AdminTask } from "@/models/AdminTask";

type Props = {
  task: AdminTask;
  onComplete: (id: string) => void;
};

export default function DueTaskCard({ task, onComplete }: Props) {
  
  const priorityClass = task.priority === 'high' 
    ? 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' 
    : task.priority === 'medium' 
    ? 'bg-yellow-100 text-yellow-600 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' 
    : 'bg-green-100 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';

  return (
    <div className="bg-white dark:bg-slate-900 border-l-4 border-yellow-500 rounded-r-xl p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition">
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${priorityClass}`}>
            {task.priority} Priority
          </span>
          <span className="text-xs font-mono text-yellow-600 dark:text-yellow-500 font-bold bg-yellow-50 dark:bg-yellow-900/10 px-2 rounded">
            DEADLINE: TODAY
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{task.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Status: {task.status}</p>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => onComplete(task.id)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-green-500/30 transition flex items-center gap-2"
        >
          <span>✅</span> DONE
        </button>
      </div>

    </div>
  );
}