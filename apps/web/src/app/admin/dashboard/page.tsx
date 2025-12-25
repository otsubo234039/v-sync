"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { AdminTask, Schedule } from "../../../types"; 
import NewAdminTaskModal from "@/components/admin/NewAdminTaskModal";
import EditAdminTaskModal from "@/components/admin/EditAdminTaskModal";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminDashboard() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  
  const [adminTasks, setAdminTasks] = useState<AdminTask[]>([]);
  const [todayStreamsCount, setTodayStreamsCount] = useState(0); 
  const [dueTodayCount, setDueTodayCount] = useState(0);       
  const [isLiveCount, setIsLiveCount] = useState(0);           

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AdminTask | null>(null);

  // ★日付が同じか判定するヘルパー関数
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const fetchDashboardData = useCallback(async () => {
    if (role !== "admin") return;
    try {
      const today = new Date();

      // 1. タスク取得 & 集計
      const tasksQ = query(collection(db, "admin_tasks"), orderBy("createdAt", "desc"));
      const tasksSnapshot = await getDocs(tasksQ);
      const tasksData = tasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminTask[];
      setAdminTasks(tasksData);

      // ★ここを修正: より確実な日付判定でカウント
      const dueCount = tasksData.filter(t => {
        if (!t.deadline || t.status === 'done') return false;
        const d = new Date(t.deadline.seconds * 1000);
        return isSameDay(d, today);
      }).length;
      setDueTodayCount(dueCount);

      // 2. スケジュール取得 & 集計
      const schedQ = query(collection(db, "schedules"));
      const schedSnapshot = await getDocs(schedQ);
      
      let streamsToday = 0;
      let liveNow = 0;

      schedSnapshot.docs.forEach(doc => {
        const d = doc.data() as Schedule;
        const start = d.startAt instanceof Timestamp ? d.startAt.toDate() : new Date(d.startAt);
        const end = d.endAt instanceof Timestamp ? d.endAt.toDate() : new Date(d.endAt);

        // 今日の配信枠数 (ここもヘルパー関数を使用)
        if (d.type === 'stream' && isSameDay(start, today)) {
          streamsToday++;
        }
        // 現在放送中かどうか
        if (d.type === 'stream' && today >= start && today <= end) {
          liveNow++;
        }
      });

      setTodayStreamsCount(streamsToday);
      setIsLiveCount(liveNow);

    } catch (error) {
      console.error(error);
    }
  }, [role]);

  useEffect(() => {
    if (!loading && role !== "admin") router.push("/");
    fetchDashboardData();
  }, [loading, role, router, fetchDashboardData]);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  if (loading || role !== "admin") return <div className="min-h-screen flex items-center justify-center text-cyan-500">LOADING...</div>;

  const todoTasks = adminTasks.filter(t => t.status === 'todo');
  const doingTasks = adminTasks.filter(t => t.status === 'doing');
  const doneTasks = adminTasks.filter(t => t.status === 'done');

  const handleCardClick = (task: AdminTask) => {
    setSelectedTask(task);
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 font-sans relative overflow-hidden transition-colors duration-300">
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-end justify-center opacity-10 dark:opacity-100 transition-opacity">
        <div 
          className="w-[200%] h-[100%] origin-bottom"
          style={{
            backgroundImage: `
              linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) translateY(100px) translateZ(-100px)',
            maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
          }}
        />
      </div>

      <div className="relative z-10 flex w-full h-full">  
        <Sidebar />

        <main className="flex-1 p-6 h-full flex flex-col overflow-hidden">
          
          <header className="flex justify-between items-end mb-4 shrink-0">
            <div>
              <h2 className="text-xs text-slate-500 font-bold tracking-widest mb-1">ADMIN CONSOLE</h2>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">SYSTEM MANAGEMENT</h1>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.displayName}</p>
              <p className="text-xs text-purple-500 dark:text-purple-400">ADMINISTRATOR</p>
            </div>
          </header>

          <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
            
            {/* SYSTEM STATUS */}
            <section className="col-span-12 lg:col-span-8 flex flex-col h-full">
              <div className="flex-1 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 relative overflow-hidden group flex flex-col justify-between shadow-sm dark:shadow-none transition-colors">
                
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline pointer-events-none opacity-50 dark:opacity-100" />
                
                <div className="flex justify-between items-start mb-2 relative z-10 shrink-0">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      📊 SYSTEM STATUS
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Real-time monitoring</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-mono text-cyan-600 dark:text-cyan-400 font-bold">NORMAL</p>
                    <p className="text-[10px] text-cyan-600/70 dark:text-cyan-500/70">OPERATIONAL STATUS</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 relative z-10 flex-1 items-center">
                  
                  {/* ON AIR */}
                  <div 
                    onClick={() => navigateTo('/admin/onair')}
                    className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 h-full flex flex-col justify-center relative overflow-hidden group/card hover:border-red-500/50 cursor-pointer transition"
                  >
                    {isLiveCount > 0 && (
                      <div className="absolute right-2 top-2 text-red-500 animate-pulse text-xs font-bold">● LIVE</div>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">ON AIR</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {todayStreamsCount} <span className="text-xs text-slate-500 font-normal">streams</span>
                    </p>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full shadow-[0_0_10px_#ef4444] transition-all duration-500" style={{ width: `${Math.min(todayStreamsCount * 10, 100)}%` }}></div>
                    </div>
                  </div>

                  {/* DUE TODAY */}
                  <div 
                    onClick={() => navigateTo('/admin/duetoday')}
                    className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 h-full flex flex-col justify-center relative overflow-hidden group/card hover:border-yellow-500/50 cursor-pointer transition"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">DUE TODAY</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{dueTodayCount}</p>
                      <p className="text-sm text-slate-500"><span className="text-[10px]">tasks left</span></p>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-full shadow-[0_0_10px_#eab308] transition-all duration-500" style={{ width: `${Math.min(dueTodayCount * 20, 100)}%` }}></div>
                    </div>
                    {dueTodayCount > 0 && (
                      <div className="absolute right-2 top-2 text-yellow-500 text-xs font-bold">⚠ {dueTodayCount} left</div>
                    )}
                  </div>

                  {/* FAN ENGAGEMENT */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4 h-full flex flex-col justify-center relative overflow-hidden group/card hover:border-pink-500/50 transition">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">TOTAL VIEWERS</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">12.5k</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 mt-3 rounded-full overflow-hidden">
                      <div className="bg-pink-500 h-full w-[80%] shadow-[0_0_10px_#ec4899]"></div>
                    </div>
                    <div className="absolute right-2 top-2 text-pink-500 dark:text-pink-400 text-xs">↗ +12%</div>
                  </div>
                </div>

                <div className="relative z-10 shrink-0 mt-4">
                  <h4 className="text-xs font-bold text-slate-500 mb-2 flex justify-between">
                    <span>VIEWER TREND (24H)</span>
                    <span className="text-[10px] text-slate-600">Peak: 24k</span>
                  </h4>
                  <div className="flex items-end gap-px h-16 w-full opacity-90">
                    {[35, 42, 45, 30, 50, 60, 75, 90, 85, 70, 
                      60, 50, 45, 40, 55, 65, 70, 80, 95, 100,
                      85, 60, 45, 50
                    ].map((h, i) => (
                      <div 
                        key={i} 
                        className="flex-1 min-w-0 bg-gradient-to-t from-purple-500/20 to-pink-500/40 border-t border-pink-400/50 hover:to-pink-400/60 transition-all duration-300 rounded-t-[1px]"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ADMIN TASKS */}
            <section className="col-span-12 lg:col-span-4 flex flex-col h-full min-h-0">
              <div className="flex-1 bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-purple-500/30 p-5 shadow-sm dark:shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)] flex flex-col min-h-0 transition-colors">
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">ADMIN TASKS</h3>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-1 rounded border border-purple-200 dark:border-purple-500/50 hover:bg-purple-500 hover:text-white transition"
                  >
                    + Add Task
                  </button>
                </div>

                <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-0">
                  <div className="shrink-0">
                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2 sticky top-0 bg-white/90 dark:bg-[#151f32]/90 backdrop-blur z-10 py-1">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span> TO DO ({todoTasks.length})
                    </h4>
                    <div className="space-y-2">
                      {todoTasks.map(t => <AdminTaskCard key={t.id} task={t} onClick={() => handleCardClick(t)} />)}
                      {todoTasks.length === 0 && <p className="text-xs text-slate-500 italic">No tasks</p>}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-500 mb-2 flex items-center gap-2 sticky top-0 bg-white/90 dark:bg-[#151f32]/90 backdrop-blur z-10 py-1">
                      <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]"></span> IN PROGRESS ({doingTasks.length})
                    </h4>
                    <div className="space-y-2">
                      {doingTasks.map(t => <AdminTaskCard key={t.id} task={t} onClick={() => handleCardClick(t)} />)}
                    </div>
                  </div>

                   <div className="shrink-0">
                    <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2 sticky top-0 bg-white/90 dark:bg-[#151f32]/90 backdrop-blur z-10 py-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]"></span> DONE ({doneTasks.length})
                    </h4>
                    <div className="space-y-2 opacity-60 hover:opacity-100 transition">
                      {doneTasks.map(t => <AdminTaskCard key={t.id} task={t} onClick={() => handleCardClick(t)} />)}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <NewAdminTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdded={fetchDashboardData} />
      <EditAdminTaskModal isOpen={!!selectedTask} task={selectedTask} onClose={() => setSelectedTask(null)} onUpdated={fetchDashboardData} />
    </div>
  );
}

function AdminTaskCard({ task, onClick }: { task: AdminTask; onClick: () => void }) {
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