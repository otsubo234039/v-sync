"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { RESOURCES } from "@/models/Booking"; // ★修正: modelsから読み込み

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
};

export default function NewBookingModal({ isOpen, onClose, onAdded }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    resourceId: RESOURCES[0].id,
    applicantName: "",
    purpose: "",
    date: "",
    start: "10:00",
    end: "11:00"
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resource = RESOURCES.find(r => r.id === formData.resourceId);
      const startAt = new Date(`${formData.date}T${formData.start}`);
      const endAt = new Date(`${formData.date}T${formData.end}`);
      
      await addDoc(collection(db, "bookings"), {
        resourceId: formData.resourceId,
        resourceName: resource?.name,
        applicantName: formData.applicantName,
        purpose: formData.purpose,
        startAt: Timestamp.fromDate(startAt),
        endAt: Timestamp.fromDate(endAt),
        status: "confirmed",
        createdAt: Timestamp.now(),
      });
      onAdded();
      onClose();
      // フォームリセットは任意
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-700 w-full max-w-md rounded-xl p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">New Booking</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-500">FACILITY</label>
            <select className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded p-2" value={formData.resourceId} onChange={e => setFormData({...formData, resourceId: e.target.value})}>
              {RESOURCES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div><label className="text-xs text-slate-500">APPLICANT</label><input type="text" required className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded p-2" value={formData.applicantName} onChange={e => setFormData({...formData, applicantName: e.target.value})} /></div>
          <div><label className="text-xs text-slate-500">PURPOSE</label><input type="text" required className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded p-2" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} /></div>
          <div className="flex gap-2">
            <input type="date" required className="bg-slate-100 dark:bg-slate-800 border-none rounded p-2" onChange={e => setFormData({...formData, date: e.target.value})} />
            <input type="time" required className="bg-slate-100 dark:bg-slate-800 border-none rounded p-2" value={formData.start} onChange={e => setFormData({...formData, start: e.target.value})} />
            <span className="self-center">~</span>
            <input type="time" required className="bg-slate-100 dark:bg-slate-800 border-none rounded p-2" value={formData.end} onChange={e => setFormData({...formData, end: e.target.value})} />
          </div>
          <div className="flex justify-end gap-2 mt-6"><button type="button" onClick={onClose} className="px-4 py-2 text-slate-500">Cancel</button><button type="submit" disabled={loading} className="bg-orange-500 text-white px-6 py-2 rounded font-bold">Reserve</button></div>
        </form>
      </div>
    </div>
  );
}