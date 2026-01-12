"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, getDocs, query } from "firebase/firestore";
import { Member } from "@/models/Member"; // ★修正: modelsから読み込み

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
};

export default function NewScheduleModal({ isOpen, onClose, onAdded }: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState({ userId: "", title: "", type: "stream", date: "", start: "19:00", end: "20:00" });
  const [loading, setLoading] = useState(false);

  // モーダルが開いた時にメンバー一覧を取得
  if (isOpen && members.length === 0) {
    getDocs(query(collection(db, "members"))).then(snap => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Member));
      setMembers(data);
      if(data.length > 0 && !formData.userId) setFormData(prev => ({...prev, userId: data[0].id}));
    });
  }

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const startAt = new Date(`${formData.date}T${formData.start}`);
      const endAt = new Date(`${formData.date}T${formData.end}`);
      
      await addDoc(collection(db, "schedules"), {
        userId: formData.userId,
        title: formData.title,
        type: formData.type,
        startAt: Timestamp.fromDate(startAt),
        endAt: Timestamp.fromDate(endAt),
        createdAt: Timestamp.now()
      });
      onAdded();
      onClose();
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 w-full max-w-md rounded-xl p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add Schedule</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="text-xs text-slate-500">MEMBER</label><select className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded p-2" value={formData.userId} onChange={e => setFormData({...formData, userId: e.target.value})}>{members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
          <div><label className="text-xs text-slate-500">TYPE</label><select className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded p-2" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}><option value="stream">🎥 Stream</option><option value="meeting">🏢 Meeting</option><option value="event">🚩 Event</option></select></div>
          <div><label className="text-xs text-slate-500">TITLE</label><input type="text" required className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded p-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
          <div className="flex gap-2">
            <input type="date" required className="bg-slate-100 dark:bg-slate-800 border-none rounded p-2" onChange={e => setFormData({...formData, date: e.target.value})} />
            <input type="time" required className="bg-slate-100 dark:bg-slate-800 border-none rounded p-2" value={formData.start} onChange={e => setFormData({...formData, start: e.target.value})} />
            <span className="self-center">~</span>
            <input type="time" required className="bg-slate-100 dark:bg-slate-800 border-none rounded p-2" value={formData.end} onChange={e => setFormData({...formData, end: e.target.value})} />
          </div>
          <div className="flex justify-end gap-2 mt-6"><button type="button" onClick={onClose} className="px-4 py-2 text-slate-500">Cancel</button><button type="submit" disabled={loading} className="bg-cyan-600 text-white px-6 py-2 rounded font-bold">Add</button></div>
        </form>
      </div>
    </div>
  );
}