// src/components/admin/NewScheduleModal.tsx
"use client";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdded: () => void; // 追加後に一覧を更新するための関数
};

export default function NewScheduleModal({ isOpen, onClose, onAdded }: Props) {
  const [loading, setLoading] = useState(false);
  
  // 入力フォームの状態
  const [formData, setFormData] = useState({
    title: "",
    type: "stream", // 初期値
    startAt: "",
    endAt: "",
    status: "draft",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Firestoreに保存
      await addDoc(collection(db, "schedules"), {
        title: formData.title,
        type: formData.type,
        status: formData.status,
        // 日付文字列をFirestoreのTimestamp型に変換
        startAt: Timestamp.fromDate(new Date(formData.startAt)),
        endAt: Timestamp.fromDate(new Date(formData.endAt)),
        userId: "liver_demo_id", // 本来は選択式ですが、一旦仮IDで固定
        createdAt: Timestamp.now(),
      });

      // 成功したら閉じる＆更新
      alert("スケジュールを登録しました！");
      onAdded();
      onClose();
    } catch (error) {
      console.error("登録エラー:", error);
      alert("登録に失敗しました...");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 背景の黒み（オーバーレイ）
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      
      {/* モーダル本体 */}
      <div className="w-full max-w-md bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] animate-fade-in-up">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-cyan-400">📝</span> New Schedule
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* タイトル入力 */}
          <div>
            <label className="block text-xs text-slate-400 mb-1">TITLE</label>
            <input
              name="title"
              type="text"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:border-cyan-500 outline-none transition"
              placeholder="例: 雑談配信 / 歌枠"
              onChange={handleChange}
            />
          </div>

          {/* タイプ選択 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">TYPE</label>
              <select
                name="type"
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:border-cyan-500 outline-none"
                onChange={handleChange}
              >
                <option value="stream">Stream (配信)</option>
                <option value="video">Video (動画)</option>
                <option value="event">Event (イベント)</option>
                <option value="meeting">Meeting (会議)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">STATUS</label>
              <select
                name="status"
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:border-cyan-500 outline-none"
                onChange={handleChange}
              >
                <option value="draft">Draft (下書き)</option>
                <option value="review">Review (確認中)</option>
                <option value="public">Public (公開)</option>
              </select>
            </div>
          </div>

          {/* 日時入力 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">START</label>
              <input
                name="startAt"
                type="datetime-local"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm focus:border-cyan-500 outline-none"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">END</label>
              <input
                name="endAt"
                type="datetime-local"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white text-sm focus:border-cyan-500 outline-none"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ボタンエリア */}
          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded shadow-[0_0_15px_rgba(6,182,212,0.4)] transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}