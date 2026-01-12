// src/components/admin/EditAdminTaskModal.tsx
"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { AdminTask } from "@/models/AdminTask";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  task: AdminTask | null; // 編集するタスクデータを受け取る
  onUpdated: () => void;  // 更新・削除後に一覧を再読込する
};

export default function EditAdminTaskModal({ isOpen, onClose, task, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    status: "todo",
    priority: "medium",
    deadline: "",
  });

  // モーダルが開いたとき、受け取ったタスクの情報をフォームに入れる
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        status: task.status,
        priority: task.priority,
        // Timestampを日付文字列(YYYY-MM-DD)に変換
        deadline: task.deadline ? new Date(task.deadline.seconds * 1000).toISOString().split('T')[0] : "",
      });
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ■ 更新処理
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = doc(db, "admin_tasks", task.id);
      await updateDoc(docRef, {
        title: formData.title,
        status: formData.status,
        priority: formData.priority,
        deadline: formData.deadline ? Timestamp.fromDate(new Date(formData.deadline)) : null,
      });
      onUpdated();
      onClose();
    } catch (error) {
      console.error("更新エラー:", error);
      alert("更新できませんでした");
    } finally {
      setLoading(false);
    }
  };

  // ■ 削除処理
  const handleDelete = async () => {
    if (!confirm("本当にこのタスクを削除しますか？")) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "admin_tasks", task.id));
      onUpdated();
      onClose();
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除できませんでした");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-600 rounded-2xl p-6 shadow-2xl animate-fade-in-up">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
          <span>Edit Task</span>
          <span className="text-xs text-slate-500 font-normal">ID: {task.id.slice(0, 6)}</span>
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* タイトル */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">TASK NAME</label>
            <input
              name="title"
              type="text"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-purple-500"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* ステータス & 優先度 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">STATUS</label>
              <select
                name="status"
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm outline-none focus:border-purple-500"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="todo">To Do</option>
                <option value="doing">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">PRIORITY</label>
              <select
                name="priority"
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm outline-none focus:border-purple-500"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low 🟢</option>
                <option value="medium">Medium 🟡</option>
                <option value="high">High 🔴</option>
              </select>
            </div>
          </div>

          {/* 期限 */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">DEADLINE</label>
            <input
              name="deadline"
              type="date"
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm outline-none focus:border-purple-500"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>

          {/* ボタンエリア */}
          <div className="flex gap-3 mt-8 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500 hover:text-white rounded transition text-sm font-bold"
            >
              Delete
            </button>
            <div className="flex-1 flex gap-2 justify-end">
                <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white transition text-sm"
                >
                Cancel
                </button>
                <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded shadow-[0_0_15px_rgba(168,85,247,0.4)] transition text-sm"
                >
                Update
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}