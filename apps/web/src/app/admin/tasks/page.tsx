// src/app/admin/tasks/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, writeBatch, doc, Timestamp } from "firebase/firestore"; // writeBatch等追加
import { AdminTask } from "../../../types";
import NewAdminTaskModal from "@/components/admin/NewAdminTaskModal";
import EditAdminTaskModal from "@/components/admin/EditAdminTaskModal";

export default function TasksPage() {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AdminTask | null>(null);

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

  // ★ デモタスク追加機能
  const addDemoTasks = async () => {
    if(!confirm("デモタスクを追加しますか？")) return;
    try {
      const batch = writeBatch(db);
      
      const today = new Date();
      const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
      const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
      const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);

      const demoTasks = [
        { title: "3期生オーディション面接", status: "doing", priority: "high", deadline: tomorrow },
        { title: "夏祭りボイス台本チェック", status: "todo", priority: "medium", deadline: nextWeek },
        { title: "サーバー負荷テスト", status: "done", priority: "low", deadline: yesterday },
        // これが「DUE TODAY」にカウントされるタスク
        { title: "コラボグッズ入稿データ確認", status: "todo", priority: "high", deadline: today }, 
      ];

      demoTasks.forEach(t => {
        const newRef = doc(collection(db, "admin_tasks"));
        batch.set(newRef, { 
          title: t.title,
          status: t.status, 
          priority: t.priority, 
          deadline: Timestamp.fromDate(t.deadline), 
          createdAt: Timestamp.now(), 
          assigneeId: "demo_user",
          description: "デモデータとして生成されたタスクです。"
        });
      });

      await batch.commit();
      fetchTasks();
      alert("デモタスクを追加しました！");
    } catch (error) { console.error(error); alert("エラーが発生しました"); }
  };

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const todos = tasks.filter(t => t.status === 'todo');
  const doings = tasks.filter(t => t.status === 'doing');
  const dones = tasks.filter(t => t.status === 'done');

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 font-sans relative overflow-hidden transition-colors">
      
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(#a855f7 1px, transparent 1px), linear-gradient(90deg, #a855f7 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)'
          }}
        />
      </div>

      <div className="relative z-10 flex w-full h-full">
        <Sidebar />

        <main className="flex-1 p-8 h-screen overflow-hidden flex flex-col">
          <header className="flex justify-between items-end mb-8 shrink-0">
            <div>
              <h2 className="text-xs text-purple-500 font-bold tracking-widest mb-1">PROJECT MANAGEMENT</h2>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">TASK BOARD</h1>
            </div>
            
            <div className="flex gap-2">
              {/* ★デモボタン追加 */}
              <button onClick={addDemoTasks} className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-full font-bold transition text-xs">🧪 Demo</button>
              <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-full font-bold shadow-lg transition flex items-center gap-2"><span>+</span> New Task</button>
            </div>
          </header>

          <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden pb-4">
            <Column title="TO DO" count={todos.length} color="bg-slate-500" tasks={todos} onTaskClick={setSelectedTask} />
            <Column title="IN PROGRESS" count={doings.length} color="bg-yellow-500" tasks={doings} onTaskClick={setSelectedTask} />
            <Column title="DONE" count={dones.length} color="bg-green-500" tasks={dones} onTaskClick={setSelectedTask} />
          </div>
        </main>
      </div>
      <NewAdminTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdded={fetchTasks} />
      <EditAdminTaskModal isOpen={!!selectedTask} task={selectedTask} onClose={() => setSelectedTask(null)} onUpdated={fetchTasks} />
    </div>
  );
}

function Column({ title, count, color, tasks, onTaskClick }: { title: string, count: number, color: string, tasks: AdminTask[], onTaskClick: (t: AdminTask) => void }) {
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
        {tasks.map(task => <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />)}
        {tasks.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-400 text-xs italic border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl">No tasks</div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, onClick }: { task: AdminTask, onClick: () => void }) {
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