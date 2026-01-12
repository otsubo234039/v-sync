"use client";
import { AdminTask } from "@/models/AdminTask";

type Props = {
  task: AdminTask;
  onClick: () => void;
};

export default function AdminTaskCard({ task, onClick }: Props) {
  const priorityInfo = task.priority === 'high' 
    ? 'text-red-500 dark:text-red-400 border-red-500/30 bg-red-50 dark:bg-slate-900' 
    : task.priority === 'medium' 
    ? 'text-yellow-600 dark:text-yellow-400 border-yellow-500/30 bg-yellow-50 dark:bg-slate-900' 
    : 'text-green-600 dark:text-green-400 border-green-500/30 bg-green-50 dark:bg-slate-900';

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-[#1E293B] p-2.5 rounded border border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 transition cursor-pointer group relative shadow-sm"
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${priorityInfo}`}>
          {task.priority}
        </span>
        {task.deadline && (
          <span className="text-[10px] text-slate-500">
             ~ {new Date(task.deadline.seconds * 1000).toLocaleDateString()}
          </span>
        )}
      </div>
      <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">{task.title}</h5>
    </div>
  );
}