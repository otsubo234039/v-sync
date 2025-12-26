"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, addDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import StaffSidebar from "@/components/staff/StaffSidebar";

type StaffTask = {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  createdAt: any;
};

// 新規タスク追加モーダル
function NewTaskModal({ onClose, onAdd }: { onClose: () => void, onAdd: (data: any) => void }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignee, setAssignee] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ title, priority, assignee, status: 'todo' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0A2A22] border border-emerald-500/30 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-6">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-emerald-400 mb-1">TASK NAME</label>
            <input type="text" required autoFocus className="w-full bg-[#020907] border border-emerald-900/50 rounded p-3 text-white focus:border-emerald-500 outline-none" placeholder="タスク内容を入力..." value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-emerald-400 mb-1">PRIORITY</label>
              <select className="w-full bg-[#020907] border border-emerald-900/50 rounded p-3 text-white focus:border-emerald-500 outline-none" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="high">🔥 High</option>
                <option value="medium">⚡ Medium</option>
                <option value="low">🌱 Low</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-emerald-400 mb-1">ASSIGNEE</label>
              <input type="text" className="w-full bg-[#020907] border border-emerald-900/50 rounded p-3 text-white focus:border-emerald-500 outline-none" placeholder="担当者" value={assignee} onChange={e => setAssignee(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-xs font-bold">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-lg">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// カンバン列
function TaskColumn({ title, count, color, tasks, onDelete }: { title: string, count: number, color: string, tasks: StaffTask[], onDelete: (id: string) => void }) {
  return (
    <div className="flex flex-col bg-[#0A2A22]/50 border border-emerald-500/20 rounded-2xl overflow-hidden h-full shadow-lg backdrop-blur-sm min-h-0">
      <div className="p-4 border-b border-emerald-500/20 bg-[#0F3F33]/50 flex justify-between items-center shrink-0">
        <h3 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-widest">
          <span className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_currentColor]`}></span>{title}
        </h3>
        <span className="text-[10px] bg-[#020907] px-2 py-0.5 rounded-full text-emerald-400 border border-emerald-500/30 font-mono">{count}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        {tasks.map(t => (
          <div key={t.id} className="group relative bg-[#0F3F33] p-4 rounded-xl border border-emerald-500/20 hover:border-emerald-400/60 transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer">
            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${t.priority === 'high' ? 'bg-red-500' : t.priority === 'medium' ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
            <div className="flex justify-between items-start mb-2 pl-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${t.priority === 'high' ? 'text-red-300 border-red-500/30 bg-red-900/20' : t.priority === 'medium' ? 'text-yellow-300 border-yellow-500/30 bg-yellow-900/20' : 'text-emerald-300 border-emerald-500/30 bg-emerald-900/20'}`}>{t.priority}</span>
              <button onClick={(e) => {e.stopPropagation(); onDelete(t.id)}} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>
            </div>
            <h4 className="text-sm font-bold text-white pl-2 mb-3 leading-snug">{t.title}</h4>
            <div className="pl-2 flex items-center gap-1 text-[10px] text-slate-400">
              👤 <span className="text-slate-200 font-bold">{t.assignee || "Unassigned"}</span>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <div className="h-24 flex items-center justify-center text-emerald-500/20 text-xs italic border-2 border-dashed border-emerald-500/10 rounded-xl">No tasks</div>}
      </div>
    </div>
  );
}

export default function StaffTasksPage() {
  const { loading } = useAuth();
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const q = query(collection(db, "staff_tasks"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StaffTask)));
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleAddTask = async (data: any) => {
    try {
      await addDoc(collection(db, "staff_tasks"), { ...data, createdAt: Timestamp.now() });
      setIsModalOpen(false);
      fetchTasks();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("削除しますか？")) return;
    try { await deleteDoc(doc(db, "staff_tasks", id)); fetchTasks(); } catch (e) { console.error(e); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-emerald-500">LOADING...</div>;

  return (
    <div className="flex h-screen w-screen bg-[#020907] text-slate-200 font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-100"><div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-[#020907] to-transparent" /><div className="w-[200%] h-[100%] origin-bottom absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.15) 1px, transparent 1px)`, backgroundSize: '40px 40px', transform: 'perspective(500px) rotateX(60deg) translateY(100px) translateZ(-100px)', maskImage: 'linear-gradient(to top, black 0%, transparent 100%)' }} /></div>
      <div className="relative z-10 flex w-full h-full">
        <StaffSidebar />
        <main className="flex-1 p-6 h-full flex flex-col overflow-hidden">
          <header className="flex justify-between items-end mb-6 shrink-0">
            <div><h2 className="text-xs text-emerald-600 font-bold tracking-widest mb-1">STAFF CONSOLE</h2><h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">TASKS</h1></div>
            <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] transition text-sm">+ Add Task</button>
          </header>
          <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden pb-2 min-h-0">
            <TaskColumn title="TO DO" count={tasks.filter(t => t.status === 'todo').length} color="bg-slate-400" tasks={tasks.filter(t => t.status === 'todo')} onDelete={handleDelete} />
            <TaskColumn title="DOING" count={tasks.filter(t => t.status === 'doing').length} color="bg-emerald-500" tasks={tasks.filter(t => t.status === 'doing')} onDelete={handleDelete} />
            <TaskColumn title="DONE" count={tasks.filter(t => t.status === 'done').length} color="bg-blue-500" tasks={tasks.filter(t => t.status === 'done')} onDelete={handleDelete} />
          </div>
        </main>
      </div>
      {isModalOpen && <NewTaskModal onClose={() => setIsModalOpen(false)} onAdd={handleAddTask} />}
    </div>
  );
}