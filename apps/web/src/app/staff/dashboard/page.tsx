"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import StaffSidebar from "@/components/staff/StaffSidebar";

export default function StaffDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // ★ リアルタイム集計用のステート
  const [stats, setStats] = useState({
    todo: 0,
    doing: 0,
    done: 0,
    total: 0
  });
  const [recentTasks, setRecentTasks] = useState<any[]>([]);

  // ★ タスクデータを取得して集計
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "staff_tasks"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // ステータスごとの件数を集計
        const todo = tasks.filter((t: any) => t.status === 'todo').length;
        const doing = tasks.filter((t: any) => t.status === 'doing').length;
        const done = tasks.filter((t: any) => t.status === 'done').length;

        setStats({ todo, doing, done, total: tasks.length });
        setRecentTasks(tasks.slice(0, 4)); // 最新4件を表示
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-emerald-500">LOADING...</div>;

  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-[#020907] text-slate-800 dark:text-slate-200 font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* 背景エフェクト */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-end justify-center opacity-10 dark:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-emerald-950/50 to-transparent pointer-events-none" />
        <div 
          className="w-[200%] h-[100%] origin-bottom absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) translateY(100px) translateZ(-100px)',
            maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)'
          }}
        />
      </div>

      <div className="relative z-10 flex w-full h-full">  
        <StaffSidebar />

        <main className="flex-1 p-8 h-full flex flex-col overflow-hidden">
          
          <header className="flex justify-between items-end mb-8 shrink-0">
            <div>
              <h2 className="text-xs text-emerald-600 dark:text-emerald-500 font-bold tracking-widest mb-1">STAFF CONSOLE</h2>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-sm">
                DASHBOARD
              </h1>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.displayName || "Staff Member"}</p>
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/5">
                PRODUCER MODE
              </p>
            </div>
          </header>

          <div className="grid grid-cols-12 gap-6 h-full min-h-0">
            
            {/* メインエリア */}
            <section className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full min-h-0">
              
              {/* スタッツカード (DB連動) */}
              <div className="grid grid-cols-3 gap-4 shrink-0">
                <StatCard title="TOTAL TASKS" value={stats.total.toString()} color="text-slate-900 dark:text-white" />
                <StatCard title="IN PROGRESS" value={stats.doing.toString()} color="text-yellow-500" />
                <StatCard title="COMPLETED" value={stats.done.toString()} color="text-emerald-400" />
              </div>

              {/* 最新タスクリスト */}
              <div className="flex-1 bg-white dark:bg-[#0A2A22] rounded-2xl border border-slate-200 dark:border-emerald-500/30 p-6 shadow-sm dark:shadow-[0_0_30px_-10px_rgba(16,185,129,0.1)] flex flex-col min-h-0 relative overflow-hidden">
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                    <span className="text-emerald-500">☑️</span> Recent Tasks
                  </h3>
                  <button 
                    onClick={() => router.push('/staff/tasks')}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3 overflow-y-auto custom-scrollbar pr-2 relative z-10">
                  {recentTasks.length === 0 && (
                     <div className="text-center text-slate-500 py-10 italic">No tasks yet.</div>
                  )}
                  {recentTasks.map(t => (
                    <div key={t.id} className="group relative bg-slate-50 dark:bg-[#0F3F33] rounded-xl border border-slate-200 dark:border-emerald-500/30 hover:border-emerald-500 dark:hover:border-emerald-400/50 transition-all duration-300 p-4 cursor-pointer hover:shadow-lg">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${t.priority === 'high' ? 'bg-red-500' : t.priority === 'medium' ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
                      <div className="flex justify-between items-start mb-1 pl-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition">{t.title}</h4>
                        </div>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                            t.status === 'todo' ? 'bg-slate-700 text-slate-300 border-slate-600' :
                            t.status === 'doing' ? 'bg-emerald-900 text-emerald-300 border-emerald-700' :
                            'bg-blue-900 text-blue-300 border-blue-700'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <div className="pl-2 text-[10px] text-slate-500 dark:text-slate-400">
                         Assignee: <span className="text-slate-300">{t.assignee || "Unassigned"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 右パネル (Notices & Shortcut) */}
            <section className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full min-h-0">
              
              <div className="flex-1 bg-gradient-to-br from-emerald-50 to-white dark:from-[#0D332A] dark:to-[#0A2A22] rounded-2xl border border-emerald-100 dark:border-emerald-500/30 p-6 shadow-sm relative overflow-hidden flex flex-col">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
                 <h3 className="text-lg font-bold text-emerald-900 dark:text-white mb-4 flex items-center gap-2">📢 Notices</h3>
                 <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                   {[1, 2].map((i) => (
                     <div key={i} className="pb-3 border-b border-emerald-200/50 dark:border-emerald-500/20 last:border-0">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">ADMIN</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-400">10 mins ago</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">全体会議の日程変更について</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          来週月曜 10:00 → 13:00に変更になります。
                        </p>
                     </div>
                   ))}
                 </div>
              </div>

               <div className="bg-white dark:bg-[#0A2A22] rounded-2xl border border-slate-200 dark:border-emerald-500/30 p-6 shadow-sm flex flex-col justify-center items-center text-center gap-3 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-2xl mb-1 border border-emerald-200 dark:border-emerald-500/20">
                   💬
                 </div>
                 <div className="relative z-10">
                   <p className="text-sm font-bold text-slate-900 dark:text-white">Team Chat</p>
                   <p className="text-xs text-slate-500 dark:text-slate-300 mb-3">チームメンバーと連絡を取りますか？</p>
                   <button 
                     onClick={() => router.push('/staff/chat')}
                     className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition text-sm"
                   >
                     Open Chat
                   </button>
                 </div>
               </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string, value: string, color: string }) {
  return (
    <div className={`bg-white dark:bg-[#0A2A22] p-5 rounded-xl border border-slate-200 dark:border-emerald-500/30 shadow-sm flex flex-col justify-between h-24 hover:-translate-y-1 transition-transform duration-300`}>
      <p className="text-[10px] font-bold text-slate-400 dark:text-emerald-200/70 tracking-wider">{title}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}