"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import StaffSidebar from "@/components/staff/StaffSidebar";
import { AdminTask } from "../../../types"; // パスが合っているか確認してください

// カンバンボードの列コンポーネント
function ProjectColumn({ title, count, color, tasks }: { title: string, count: number, color: string, tasks: AdminTask[] }) {
  return (
    <div className="flex flex-col bg-[#0A2A22] border border-emerald-500/30 rounded-2xl overflow-hidden h-full shadow-lg">
      {/* 列ヘッダー */}
      <div className="p-4 border-b border-emerald-500/20 bg-[#0F3F33]/50 flex justify-between items-center backdrop-blur-sm">
        <h3 className="font-bold text-white flex items-center gap-2 text-sm uppercase tracking-wider">
          <span className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_currentColor]`}></span>
          {title}
        </h3>
        <span className="text-xs bg-[#020907] px-2 py-0.5 rounded text-emerald-400 border border-emerald-500/30 font-mono">
          {count}
        </span>
      </div>
      
      {/* タスクリスト */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className="group relative bg-[#0F3F33] p-4 rounded-xl border border-emerald-500/20 hover:border-emerald-400/60 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
          >
            {/* 左端のカラーバー */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-colors ${
              task.priority === 'high' ? 'bg-red-500' : 
              task.priority === 'medium' ? 'bg-yellow-500' : 'bg-emerald-500'
            }`} />

            <div className="flex justify-between items-start mb-2 pl-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                task.priority === 'high' ? 'text-red-300 border-red-500/30 bg-red-900/20' : 
                task.priority === 'medium' ? 'text-yellow-300 border-yellow-500/30 bg-yellow-900/20' : 
                'text-emerald-300 border-emerald-500/30 bg-emerald-900/20'
              }`}>
                {task.priority.toUpperCase()}
              </span>
              {task.deadline && (
                <span className="text-[10px] text-slate-300 font-mono bg-[#020907] px-1.5 py-0.5 rounded">
                   {new Date(task.deadline.seconds * 1000).toLocaleDateString()}
                </span>
              )}
            </div>
            
            <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition pl-2 mb-2 leading-snug">
              {task.title}
            </h4>
            
            <div className="pl-2 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                Assignee: <span className="text-slate-200">{task.assigneeId || "Unassigned"}</span>
              </span>
              <span className="font-mono opacity-50">ID: {task.id.slice(0, 4)}</span>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="h-24 flex items-center justify-center text-emerald-200/30 text-xs italic border-2 border-dashed border-emerald-500/20 rounded-xl">
            No projects in this stage
          </div>
        )}
      </div>
    </div>
  );
}

export default function StaffProjectsPage() {
  const { loading } = useAuth();
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  
  // 管理者側のタスクDBをそのまま参照（共有）
  const fetchTasks = useCallback(async () => {
    try {
      const q = query(collection(db, "admin_tasks"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminTask[];
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-emerald-500">LOADING...</div>;

  // ステータスで振り分け
  const planning = tasks.filter(t => t.status === 'todo');
  const inProgress = tasks.filter(t => t.status === 'doing');
  const completed = tasks.filter(t => t.status === 'done');

  return (
    <div className="flex h-screen w-screen bg-[#020907] text-slate-200 font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* 背景エフェクト */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-end justify-center opacity-100">
        <div 
          className="w-[200%] h-[100%] origin-bottom"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) translateY(100px) translateZ(-100px)',
            maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-[#020907] via-[#020907]/80 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 flex w-full h-full">  
        <StaffSidebar />

        <main className="flex-1 p-6 h-full flex flex-col overflow-hidden">
          
          <header className="flex justify-between items-end mb-6 shrink-0">
            <div>
              <h2 className="text-xs text-emerald-600 font-bold tracking-widest mb-1">STAFF CONSOLE</h2>
              <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                PROJECTS
              </h1>
            </div>
            <div>
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] transition text-sm flex items-center gap-2">
                <span>+</span> New Proposal
              </button>
            </div>
          </header>

          {/* カンバンボード */}
          <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden pb-2 min-h-0">
            <ProjectColumn 
              title="PLANNING / TODO" 
              count={planning.length} 
              color="bg-slate-400" 
              tasks={planning} 
            />
            <ProjectColumn 
              title="IN PROGRESS" 
              count={inProgress.length} 
              color="bg-emerald-500" 
              tasks={inProgress} 
            />
            <ProjectColumn 
              title="COMPLETED" 
              count={completed.length} 
              color="bg-blue-500" 
              tasks={completed} 
            />
          </div>

        </main>
      </div>
    </div>
  );
}