// src/components/admin/NewBookingModal.tsx
"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void;
};

// 管理対象のリソース一覧
export const RESOURCES = [
  { id: "studio_a", name: "Studio A (3D Live)", type: "studio" },
  { id: "studio_b", name: "Studio B (Recording)", type: "studio" },
  { id: "booth", name: "Vocal Booth", type: "studio" },
  { id: "mocap_suit", name: "Mocap Suit X", type: "equipment" },
  { id: "vr_headset", name: "VR Headset Set", type: "equipment" },
];

export default function NewBookingModal({ isOpen, onClose, onAdded }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    resourceId: RESOURCES[0].id,
    applicantName: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "13:00",
    endTime: "15:00",
    purpose: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.date}T${formData.endTime}`);
      const resource = RESOURCES.find(r => r.id === formData.resourceId);

      await addDoc(collection(db, "bookings"), {
        resourceId: formData.resourceId,
        resourceName: resource?.name || "Unknown",
        applicantName: formData.applicantName,
        startAt: Timestamp.fromDate(startDateTime),
        endAt: Timestamp.fromDate(endDateTime),
        purpose: formData.purpose,
        status: "confirmed",
        createdAt: new Date(),
      });

      onAdded();
      onClose();
      // Reset form (optional)
      setFormData({ ...formData, applicantName: "", purpose: "" });
    } catch (error) {
      console.error(error);
      alert("予約に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-orange-500/50 rounded-2xl p-6 shadow-xl animate-fade-in-up">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="text-orange-500">🏢</span> New Booking
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* リソース選択 */}
          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">RESOURCE</label>
            <select
              name="resourceId"
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white outline-none focus:border-orange-500"
              value={formData.resourceId}
              onChange={handleChange}
            >
              {RESOURCES.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {/* 予約者名 */}
          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">APPLICANT</label>
            <input
              name="applicantName"
              type="text"
              required
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white outline-none focus:border-orange-500"
              placeholder="使用者の名前 (例: 月ノ美兎)"
              value={formData.applicantName}
              onChange={handleChange}
            />
          </div>

          {/* 日付と時間 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">DATE</label>
              <input
                name="date"
                type="date"
                required
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white outline-none focus:border-orange-500"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">START</label>
              <input
                name="startTime"
                type="time"
                required
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white outline-none focus:border-orange-500"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">END</label>
              <input
                name="endTime"
                type="time"
                required
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white outline-none focus:border-orange-500"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 目的 */}
          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">PURPOSE</label>
            <input
              name="purpose"
              type="text"
              required
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white outline-none focus:border-orange-500"
              placeholder="例: 新衣装お披露目配信"
              value={formData.purpose}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition">Cancel</button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-orange-500 hover:bg-orange-400 text-white font-bold rounded transition shadow-md"
            >
              Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}