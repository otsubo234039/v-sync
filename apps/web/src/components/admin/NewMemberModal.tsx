"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function NewMemberModal({ isOpen, onClose, onAdded }: { isOpen: boolean, onClose: () => void, onAdded: () => void }) {
  const [name, setName] = useState("");
  const [generation, setGeneration] = useState("1期生");
  const [color, setColor] = useState("#22d3ee"); // デフォルトCyan

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "members"), {
        name,
        generation,
        color,
        status: "active",
        createdAt: Timestamp.now(),
      });
      onAdded(); // リスト再取得
      onClose(); // 閉じる
      // リセット
      setName("");
      setGeneration("1期生");
    } catch (error) {
      console.error("Error adding member:", error);
      alert("登録に失敗しました");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#1E293B] border border-cyan-500/30 w-full max-w-md rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-6">Add New Member</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-cyan-500 mb-1">NAME</label>
            <input 
              type="text" required autoFocus
              className="w-full bg-[#0F172A] border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
              placeholder="ライバー名"
              value={name} onChange={e => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-cyan-500 mb-1">GENERATION</label>
            <select 
              className="w-full bg-[#0F172A] border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
              value={generation} onChange={e => setGeneration(e.target.value)}
            >
              <option value="1期生">1期生</option>
              <option value="2期生">2期生</option>
              <option value="3期生">3期生</option>
              <option value="ゲーマーズ">ゲーマーズ</option>
              <option value="運営">運営スタッフ</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-cyan-500 mb-1">THEME COLOR</label>
            <div className="flex gap-2">
              <input 
                type="color" 
                className="h-10 w-20 bg-transparent cursor-pointer"
                value={color} onChange={e => setColor(e.target.value)}
              />
              <input 
                type="text" 
                className="flex-1 bg-[#0F172A] border border-slate-700 rounded p-2 text-white text-sm font-mono"
                value={color} onChange={e => setColor(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white text-sm font-bold">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold text-sm shadow-lg">Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}