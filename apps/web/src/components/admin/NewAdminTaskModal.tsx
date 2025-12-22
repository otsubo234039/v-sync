// src/components/admin/NewAdminTaskModal.tsx
"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
};

export default function NewAdminTaskModal({ isOpen, onClose, onAdded }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    priority: "medium",
    deadline: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ★保存先を 'admin_tasks' に変更
      await addDoc(collection(db, "admin_tasks"), {
        title: formData.title,
        status: "todo", // 初期状態
        priority: formData.priority,
        deadline: formData.deadline ? Timestamp.fromDate(new Date(formData.deadline)) : null,
        assigneeId: user?.uid, // 作成者を担当者に
        createdAt: Timestamp.now(),
      });

      onAdded();
      onClose();
      setFormData({ title: "", priority: "medium", deadline: "" }); // フォームリセット
    } catch (error) {
      console.error("エラー:", error);
      alert("登録失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-slate-900 border border-purple-500/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.3)] animate-fade-in-up">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-purple-400">⚡</span> Admin Task
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* タスク名 */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">TASK NAME</label>
            <input
              name="title"
              type="text"
              required
              autoFocus
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-purple-500 transition"
              placeholder="例: 機材発注、契約書確認"
              onChange={handleChange}
              value={formData.title}
            />
          </div>

          {/* 優先度と期限 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">PRIORITY</label>
              <select
                name="priority"
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm outline-none focus:border-purple-500"
                onChange={handleChange}
                value={formData.priority}
              >
                <option value="low">Low 🟢</option>
                <option value="medium">Medium 🟡</option>
                <option value="high">High 🔴</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">DEADLINE</label>
              <input
                name="deadline"
                type="date"
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm outline-none focus:border-purple-500"
                onChange={handleChange}
                value={formData.deadline}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-slate-400 hover:text-white">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded transition shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}