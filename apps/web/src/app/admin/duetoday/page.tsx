"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp, updateDoc, doc } from "firebase/firestore";
import { AdminTask } from "../../../types";

export default function DueTodayPage() {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const q = query(collection(db, "admin_tasks")); // 本当はここで日付フィルタ推奨
      const snapshot = await getDocs(q);
      const today = new Date().toLocaleDateString();

      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as AdminTask))
        .filter(t => {
          if (!t.deadline) return false;
          // 期限が今日 かつ 完了していないもの
          const dDate = new Date(t.deadline.seconds * 1000);
          return dDate.toLocaleDateString() === today && t.status !== 'done';
        });

      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleComplete = async (taskId: string) => {
    if(!confirm("完了にしますか？")) return;
    try {
      await updateDoc(doc(db, "admin_tasks", taskId), { status: 'done' });
      fetchTasks(); // リロード
    } catch (e) {
      console.error(e);
    }
  };

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
              <div key={task.id} className="bg-white dark:bg-slate-900 border-l-4 border-yellow-500 rounded-r-xl p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border 
                      ${task.priority === 'high' ? 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : 
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' :
                        'bg-green-100 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'}`}>
                      {task.priority} Priority
                    </span>
                    <span className="text-xs font-mono text-yellow-600 dark:text-yellow-500 font-bold bg-yellow-50 dark:bg-yellow-900/10 px-2 rounded">
                      DEADLINE: TODAY
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{task.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Status: {task.status}</p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleComplete(task.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-green-500/30 transition flex items-center gap-2"
                  >
                    <span>✅</span> DONE
                  </button>
                </div>

              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}