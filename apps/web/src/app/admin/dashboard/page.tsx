"use client";
import NewAdminTaskModal from "@/components/admin/NewAdminTaskModal";
import EditAdminTaskModal from "@/components/admin/EditAdminTaskModal";
import AdminTaskCard from "@/components/admin/dashboard/AdminTaskCard";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

export default function AdminDashboard() {
  const {
    user, loading, role, adminTasks, todayStreamsCount, dueTodayCount, isLiveCount, isModalOpen, setIsModalOpen, selectedTask, setSelectedTask, fetchDashboardData, navigateTo, handleCardClick
  } = useAdminDashboard();

  if (loading || role !== "admin") return <div className="min-h-screen flex items-center justify-center text-cyan-500">LOADING...</div>;

  const todoTasks = adminTasks.filter(t => t.status === 'todo');
  const doingTasks = adminTasks.filter(t => t.status === 'doing');

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden">
      
      <header className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-xs font-bold tracking-widest mb-1 text-slate-500">ADMIN CONSOLE</h2>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            SYSTEM MANAGEMENT
          </h1>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.displayName}</p>
          <p className="text-xs text-cyan-600 dark:text-cyan-400">ADMINISTRATOR</p>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* SYSTEM STATUS */}
        <section className="col-span-12 lg:col-span-8 flex flex-col h-full">
          <div className="flex-1 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-sm border transition-colors duration-300
            bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur-md">
            
            <div className="flex justify-between items-start mb-4 relative z-10 shrink-0">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                  SYSTEM STATUS
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Real-time monitoring</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-mono font-bold text-cyan-600 dark:text-cyan-400">NORMAL</p>
                <p className="text-[10px] text-slate-500">OPERATIONAL</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 relative z-10 flex-1 items-center">
              {/* 各カード */}
              <div onClick={() => navigateTo('/admin/onair')} className="rounded-2xl p-5 h-full flex flex-col justify-center relative overflow-hidden cursor-pointer transition active:scale-95 duration-200 hover:shadow-md
                bg-white dark:bg-black/40 border border-slate-100 dark:border-slate-800 shadow-sm">
                {isLiveCount > 0 && <div className="absolute right-4 top-4 text-red-500 animate-pulse text-xs font-bold">● LIVE</div>}
                <p className="text-xs text-slate-500 mb-1">ON AIR</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white">{todayStreamsCount}</p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 mt-4 rounded-full overflow-hidden"><div className="bg-red-500 h-full" style={{ width: `${Math.min(todayStreamsCount * 10, 100)}%` }}></div></div>
              </div>

              <div onClick={() => navigateTo('/admin/duetoday')} className="rounded-2xl p-5 h-full flex flex-col justify-center relative overflow-hidden cursor-pointer transition active:scale-95 duration-200 hover:shadow-md
                bg-white dark:bg-black/40 border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-xs text-slate-500 mb-1">DUE TODAY</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white">{dueTodayCount}</p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 mt-4 rounded-full overflow-hidden"><div className="bg-yellow-500 h-full" style={{ width: `${Math.min(dueTodayCount * 20, 100)}%` }}></div></div>
              </div>

              <div className="rounded-2xl p-5 h-full flex flex-col justify-center relative overflow-hidden hover:shadow-md transition
                bg-white dark:bg-black/40 border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-xs text-slate-500 mb-1">VIEWERS</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white">12.5k</p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 mt-4 rounded-full overflow-hidden"><div className="bg-pink-500 h-full w-[80%]"></div></div>
              </div>
            </div>
          </div>
        </section>

        {/* TASKS */}
        <section className="col-span-12 lg:col-span-4 flex flex-col h-full min-h-0">
          <div className="flex-1 rounded-3xl p-6 shadow-sm border transition-colors duration-300 flex flex-col min-h-0
            bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">TASKS</h3>
              <button onClick={() => setIsModalOpen(true)} className="text-xs bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:text-cyan-500 transition font-bold text-slate-500 dark:text-slate-400">
                + Add
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-0">
              <div className="shrink-0">
                <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-2">TO DO ({todoTasks.length})</h4>
                <div className="space-y-2">{todoTasks.map(t => <AdminTaskCard key={t.id} task={t} onClick={() => handleCardClick(t)} />)}</div>
              </div>
              <div className="shrink-0">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-500 mb-2 flex items-center gap-2">PROGRESS ({doingTasks.length})</h4>
                <div className="space-y-2">{doingTasks.map(t => <AdminTaskCard key={t.id} task={t} onClick={() => handleCardClick(t)} />)}</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <NewAdminTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdded={fetchDashboardData} />
      <EditAdminTaskModal isOpen={!!selectedTask} task={selectedTask} onClose={() => setSelectedTask(null)} onUpdated={fetchDashboardData} />
    </div>
  );
}