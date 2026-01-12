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
  const [formData, setFormData] = useState({ title: "", priority: "medium", deadline: "" });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "admin_tasks"), {
        title: formData.title,
        status: "todo",
        priority: formData.priority,
        deadline: formData.deadline ? Timestamp.fromDate(new Date(formData.deadline)) : null,
        assigneeId: user?.uid,
        createdAt: Timestamp.now(),
      });
      onAdded();
      onClose();
      setFormData({ title: "", priority: "medium", deadline: "" });
    } catch (error) {
      console.error(error);
      alert("Error adding task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm bg-slate-900 border border-purple-500/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.3)] animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><span className="text-purple-400">⚡</span> New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">TASK NAME</label>
            <input name="title" type="text" required autoFocus className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-purple-500 transition" placeholder="Enter task name..." onChange={e => setFormData({ ...formData, title: e.target.value })} value={formData.title} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">PRIORITY</label>
              <select name="priority" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm outline-none focus:border-purple-500" onChange={e => setFormData({ ...formData, priority: e.target.value })} value={formData.priority}>
                <option value="low">Low 🟢</option>
                <option value="medium">Medium 🟡</option>
                <option value="high">High 🔴</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">DEADLINE</label>
              <input name="deadline" type="date" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm outline-none focus:border-purple-500" onChange={e => setFormData({ ...formData, deadline: e.target.value })} value={formData.deadline} />
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-slate-400 hover:text-white text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded transition shadow-[0_0_15px_rgba(168,85,247,0.4)] text-sm">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}