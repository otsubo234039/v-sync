"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
};

export default function NewMemberModal({ isOpen, onClose, onAdded }: Props) {
  const [name, setName] = useState("");
  const [generation, setGeneration] = useState("");
  const [color, setColor] = useState("#22d3ee");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "members"), {
        name, generation, color,
        status: "active",
        createdAt: Timestamp.now()
      });
      onAdded();
      onClose();
      setName(""); setGeneration("");
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0F172A] border border-slate-700 w-full max-w-sm rounded-xl p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-4">Add New Member</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-xs text-slate-400">NAME</label><input className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" value={name} onChange={e => setName(e.target.value)} required /></div>
          <div><label className="text-xs text-slate-400">GENERATION</label><input className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" value={generation} onChange={e => setGeneration(e.target.value)} placeholder="e.g. 1期生" required /></div>
          <div><label className="text-xs text-slate-400">THEME COLOR</label><div className="flex gap-2"><input type="color" className="h-10 w-10 bg-transparent border-none" value={color} onChange={e => setColor(e.target.value)} /><input className="flex-1 bg-slate-800 border border-slate-600 rounded p-2 text-white font-mono" value={color} onChange={e => setColor(e.target.value)} /></div></div>
          <div className="flex justify-end gap-2 mt-6"><button type="button" onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button><button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded font-bold">{loading ? "..." : "Add"}</button></div>
        </form>
      </div>
    </div>
  );
}