"use client";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  onClose: () => void;
  onAdd: (data: any) => void;
};

export default function NewTaskModal({ onClose, onAdd }: Props) {
  const { themeMode } = useTheme();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignee, setAssignee] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ title, priority, assignee, status: 'todo' });
  };

  const inputClass = `w-full border rounded p-3 outline-none focus:border-brand transition 
    ${themeMode === 'dark' ? 'bg-black/50 border-brand/30 text-white' : 'bg-white border-brand/30 text-slate-800'}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className={`border border-brand/30 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in duration-200 
        ${themeMode === 'dark' ? 'bg-[#0A1010]' : 'bg-white'}`} 
        onClick={e => e.stopPropagation()}
      >
        <h2 className={`text-xl font-bold mb-6 ${themeMode === 'dark' ? 'text-white' : 'text-slate-900'}`}>Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand mb-1">TASK NAME</label>
            <input type="text" required autoFocus className={inputClass} placeholder="タスク内容を入力..." value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-brand mb-1">PRIORITY</label>
              <select className={inputClass} value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="high">🔥 High</option>
                <option value="medium">⚡ Medium</option>
                <option value="low">🌱 Low</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-brand mb-1">ASSIGNEE</label>
              <input type="text" className={inputClass} placeholder="担当者" value={assignee} onChange={e => setAssignee(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-brand text-xs font-bold">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-brand hover:brightness-110 text-black rounded-lg font-bold text-sm shadow-lg">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}