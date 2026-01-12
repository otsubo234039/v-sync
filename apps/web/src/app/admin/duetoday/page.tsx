"use client";
import Sidebar from "@/components/admin/Sidebar";
import DueTaskCard from "@/components/admin/duetoday/DueTaskCard";
import { useAdminDueToday } from "@/hooks/useAdminDueToday";

export default function DueTodayPage() {
  const { tasks, loading, handleComplete } = useAdminDueToday();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 font-sans relative overflow-hidden transition-colors">
      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        
        <main className="flex-1 p-8 h-screen overflow-y-auto custom-scrollbar flex flex-col">
          
          <header className="mb-8 shrink-0">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <span className="text-yellow-500">⚠️</span> DUE TODAY
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              本日中に完了が必要なタスク一覧です。優先的に処理してください。
            </p>
          </header>

          {loading && <div className="text-center mt-20 text-slate-400">Loading tasks...</div>}

          {!loading && tasks.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Clear!</h2>
              <p className="text-slate-500">今日締切のタスクはありません。</p>
            </div>
          )}

          <div className="space-y-3">
            {tasks.map((task) => (
              <DueTaskCard key={task.id} task={task} onComplete={handleComplete} />
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}