"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { AdminTask } from "../../../types";
import NewAdminTaskModal from "@/components/admin/NewAdminTaskModal";
import EditAdminTaskModal from "@/components/admin/EditAdminTaskModal";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminDashboard() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  
  const [adminTasks, setAdminTasks] = useState<AdminTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AdminTask | null>(null);

  const fetchAdminTasks = useCallback(async () => {
    if (role !== "admin") return;
    try {
      const q = query(collection(db, "admin_tasks"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminTask[];
      setAdminTasks(data);
    } catch (error) {
      console.error(error);
    }
  }, [role]);

  useEffect(() => {
    if (!loading && role !== "admin") router.push("/");
    fetchAdminTasks();
  }, [loading, role, router, fetchAdminTasks]);

  if (loading || role !== "admin") return <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-cyan-400">LOADING...</div>;

  const todoTasks = adminTasks.filter(t => t.status === 'todo');
  const doingTasks = adminTasks.filter(t => t.status === 'doing');
  const doneTasks = adminTasks.filter(t => t.status === 'done');

  // カードがクリックされた時の処理
  const handleCardClick = (task: AdminTask) => {
    console.log("クリックされました！ID:", task.id);
    setSelectedTask(task);
  };

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-200 font-sans relative overflow-hidden">
      
      {/* 背景エフェクト */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-end justify-center">
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

        <main className="flex-1 p-8 overflow-hidden h-screen overflow-y-auto no-scrollbar">
          <header className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xs text-purple-500 font-bold tracking-widest mb-1">ADMIN CONSOLE</h2>
              <h1 className="text-3xl font-bold text-white tracking-tight">SYSTEM MANAGEMENT</h1>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">{user?.displayName}</p>
              <p className="text-xs text-purple-400">ADMINISTRATOR</p>
            </div>
          </header>

          <div className="grid grid-cols-12 gap-6 pb-20">
            
            {/* SYSTEM STATUS エリア */}
            <section className="col-span-12 lg:col-span-8 flex flex-col gap-6">
              
              <div className="flex-1 bg-slate-800/50 rounded-2xl border border-slate-700/50 p-5 relative overflow-hidden group">
                
                {/* 背景の装飾 */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline pointer-events-none" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      📊 SYSTEM STATUS
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">Real-time monitoring</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-mono text-cyan-400 font-bold">NORMAL</p>
                    <p className="text-[10px] text-cyan-500/70">OPERATIONAL STATUS</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 relative z-10">
                  
                  {/* ON AIR (赤) */}
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 relative overflow-hidden group/card hover:border-red-500/50 transition">
                    <div className="absolute right-2 top-2 text-red-500 animate-pulse text-xs font-bold">● LIVE</div>
                    <p className="text-xs text-slate-400 mb-1">ON AIR</p>
                    <p className="text-xl font-bold text-white">3 <span className="text-xs text-slate-500 font-normal">streams</span></p>
                    <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full w-[12%] shadow-[0_0_10px_#ef4444]"></div>
                    </div>
                  </div>

                  {/* SUBMISSIONS (黄色: 注意) */}
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 relative overflow-hidden group/card hover:border-yellow-500/50 transition">
                    <p className="text-xs text-slate-400 mb-1">DUE TODAY</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-xl font-bold text-white">2</p>
                      <p className="text-sm text-slate-500">/ 5 <span className="text-[10px]">done</span></p>
                    </div>
                    <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-full w-[40%] shadow-[0_0_10px_#eab308]"></div>
                    </div>
                    <div className="absolute right-2 top-2 text-yellow-500 text-xs font-bold">⚠ 3 left</div>
                  </div>

                  {/* FAN ENGAGEMENT (ピンク: ファン) */}
                  <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 relative overflow-hidden group/card hover:border-pink-500/50 transition">
                    <p className="text-xs text-slate-400 mb-1">TOTAL VIEWERS</p>
                    <p className="text-xl font-bold text-white">12.5k</p>
                    <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
                      <div className="bg-pink-500 h-full w-[80%] shadow-[0_0_10px_#ec4899]"></div>
                    </div>
                    <div className="absolute right-2 top-2 text-pink-400 text-xs">↗ +12%</div>
                  </div>
                </div>

                {/* 下段：視聴者数の推移グラフ */}
                <div className="relative z-10">
                  <h4 className="text-xs font-bold text-slate-500 mb-2 flex justify-between">
                    <span>VIEWER TREND (24H)</span>
                    <span className="text-[10px] text-slate-600">Peak: 24k</span>
                  </h4>
                  <div className="flex items-end gap-px h-12 w-full opacity-90">
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

            {/* ADMIN TASKS エリア */}
            <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              
              <div className="flex-1 bg-slate-800/80 rounded-2xl border border-purple-500/30 p-5 shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)] flex flex-col max-h-[calc(100vh-140px)]">
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <h3 className="text-lg font-bold text-white">ADMIN TASKS</h3>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/50 hover:bg-purple-500 hover:text-white transition shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                  >
                    + Add Task
                  </button>
                </div>

                <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
                  
                  {/* TODO */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-slate-400"></span> TO DO ({todoTasks.length})
                    </h4>
                    <div className="space-y-2">
                      {todoTasks.map(t => (
                        <AdminTaskCard key={t.id} task={t} onClick={() => handleCardClick(t)} />
                      ))}
                      {todoTasks.length === 0 && <p className="text-xs text-slate-600 italic">No tasks</p>}
                    </div>
                  </div>

                  {/* DOING (黄色: 進行中) */}
                  <div>
                    <h4 className="text-xs font-bold text-yellow-500 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]"></span> IN PROGRESS ({doingTasks.length})
                    </h4>
                    <div className="space-y-2">
                      {doingTasks.map(t => (
                        <AdminTaskCard key={t.id} task={t} onClick={() => handleCardClick(t)} />
                      ))}
                    </div>
                  </div>

                   {/* DONE (緑: 完了) */}
                   <div>
                    <h4 className="text-xs font-bold text-green-400 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80]"></span> DONE ({doneTasks.length})
                    </h4>
                    <div className="space-y-2 opacity-60 hover:opacity-100 transition">
                      {doneTasks.map(t => (
                        <AdminTaskCard key={t.id} task={t} onClick={() => handleCardClick(t)} />
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </section>
          </div>
        </main>
      </div>

      <NewAdminTaskModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdded={fetchAdminTasks} 
      />

      <EditAdminTaskModal
        isOpen={!!selectedTask}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdated={fetchAdminTasks}
      />
    </div>
  );
}

function AdminTaskCard({ task, onClick }: { task: AdminTask; onClick: () => void }) {
  // ★Medium優先度を黄色に戻しました
  const priorityColor = task.priority === 'high' ? 'text-red-400 border-red-400/30' : 
                        task.priority === 'medium' ? 'text-yellow-400 border-yellow-400/30' : 'text-green-400 border-green-400/30';

  return (
    <div 
      onClick={onClick}
      className="bg-[#1E293B] p-2.5 rounded border border-slate-700 hover:border-purple-500 transition cursor-pointer group relative shadow-sm"
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${priorityColor} bg-slate-900`}>
          {task.priority}
        </span>
        {task.deadline && (
          <span className="text-[10px] text-slate-500">
             ~ {new Date(task.deadline.seconds * 1000).toLocaleDateString()}
          </span>
        )}
      </div>
      <h5 className="text-xs font-bold text-slate-200 group-hover:text-purple-400 transition">{task.title}</h5>
    </div>
  );
}