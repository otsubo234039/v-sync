"use client";
import { AdminTask } from "@/models/AdminTask";
import TaskCard from "./TaskCard";

type Props = {
  title: string;
  count: number;
  color: string;
  tasks: AdminTask[];
  onTaskClick: (t: AdminTask) => void;
};

export default function TaskColumn({ title, count, color, tasks, onTaskClick }: Props) {
  return (
    <div className="flex flex-col bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden h-full transition-colors">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/30 flex justify-between items-center backdrop-blur-sm">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${color} shadow-[0_0_8px_currentColor]`}></span>
          {title}
        </h3>
        <span className="text-xs bg-white dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{count}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs italic border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl">No tasks</div>
        )}
      </div>
    </div>
  );
}