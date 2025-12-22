// src/components/admin/NewMemberModal.tsx
"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
};

export default function NewMemberModal({ isOpen, onClose, onAdded }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    generation: "",
    status: "active",
    color: "#a855f7", // デフォルト色（紫）
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "members"), {
        ...formData,
        createdAt: new Date(),
      });
      onAdded();
      onClose();
      // リセット
      setFormData({ name: "", generation: "", status: "active", color: "#a855f7" });
    } catch (error) {
      console.error("Error:", error);
      alert("登録失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.3)] animate-fade-in-up">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-cyan-400">👤</span> New Member
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 名前 */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">NAME</label>
            <input
              name="name"
              type="text"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-cyan-500"
              placeholder="例: 田中タロウ"
              onChange={handleChange}
              value={formData.name}
            />
          </div>

          {/* 期生 & ステータス */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">GENERATION</label>
              <input
                name="generation"
                type="text"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white outline-none focus:border-cyan-500"
                placeholder="例: 1期生"
                onChange={handleChange}
                value={formData.generation}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">STATUS</label>
              <select
                name="status"
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm outline-none focus:border-cyan-500"
                onChange={handleChange}
                value={formData.status}
              >
                <option value="active">Active 🟢</option>
                <option value="resting">Resting 🌙</option>
                <option value="graduated">Graduated 🎓</option>
              </select>
            </div>
          </div>

          {/* テーマカラー選択 (カラーピッカーに変更) */}
          <div>
            <label className="block text-xs text-slate-400 mb-2">THEME COLOR</label>
            <div className="flex items-center gap-4 bg-slate-800 p-2 rounded border border-slate-700">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-10 h-10 rounded cursor-pointer bg-transparent border-none"
              />
              <div className="flex-1">
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full bg-transparent text-white font-mono uppercase outline-none"
                  placeholder="#000000"
                  pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                />
              </div>
              {/* プレビュー用の光る丸 */}
              <div 
                className="w-8 h-8 rounded-full shadow-[0_0_10px_currentColor]"
                style={{ backgroundColor: formData.color, color: formData.color }}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-800">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-slate-400 hover:text-white">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded transition shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}