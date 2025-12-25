// src/components/admin/EditProfileModal.tsx
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "firebase/auth";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EditProfileModal({ isOpen, onClose }: Props) {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  // モーダルが開いた時に、現在の名前をセット
  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Firebaseのユーザー情報を更新
      await updateProfile(user, {
        displayName: displayName,
        // photoURL: ... (アイコン画像変更もここで可能)
      });
      
      alert("プロフィールを更新しました！");
      onClose();
      
      // 画面上の名前を即座に反映させるためリロード（簡易的な対応）
      window.location.reload();
      
    } catch (error) {
      console.error(error);
      alert("更新に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-500/50 rounded-2xl p-6 shadow-xl animate-fade-in-up transition-colors">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <span className="text-cyan-600 dark:text-cyan-400">👤</span> Edit Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Display Name Input */}
          <div>
            <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">DISPLAY NAME</label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-2 text-slate-900 dark:text-white outline-none focus:border-cyan-500 transition-colors"
              placeholder="Enter new name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded transition shadow-md disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}