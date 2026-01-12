"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useTheme } from "next-themes";
import EditProfileModal from "@/components/admin/EditProfileModal";

export default function GeneralSettings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) { alert("非対応ブラウザです"); return; }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === "granted") new Notification("V-Sync Notifications", { body: "通知オン🚀" });
  };

  const sendTestNotification = () => {
    if (notificationPermission === "granted") new Notification("New Task", { body: "テスト通知です" });
    else alert("通知を許可してください");
  };

  const handleLogout = async () => {
    if (confirm("ログアウトしますか？")) {
      try {
        await signOut(auth);
        router.push("/");
      } catch (error) { console.error("Logout failed", error); }
    }
  };

  return (
    <div className="max-w-2xl space-y-8 pb-20">
      <section className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Profile Settings</h3>
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl">👤</div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Display Name</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{user?.displayName || "Admin User"}</p>
          </div>
          <button onClick={() => setIsEditProfileOpen(true)} className="ml-auto text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-3 py-1.5 rounded text-slate-700 dark:text-white transition">Edit Profile</button>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-6 shadow-sm dark:shadow-none">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">System Preferences</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/30">
            <div><p className="text-slate-900 dark:text-white font-bold text-sm">Appearance</p><p className="text-xs text-slate-500">Customize theme</p></div>
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
              <button onClick={() => setTheme("light")} className={`px-3 py-1 text-xs rounded-md transition font-bold ${theme === 'light' ? 'bg-white text-cyan-600 shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>☀ Light</button>
              <button onClick={() => setTheme("dark")} className={`px-3 py-1 text-xs rounded-md transition font-bold ${theme === 'dark' ? 'bg-slate-700 text-cyan-400 shadow' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>🌙 Dark</button>
              <button onClick={() => setTheme("system")} className={`px-3 py-1 text-xs rounded-md transition font-bold ${theme === 'system' ? 'bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white shadow' : 'text-slate-500'}`}>💻 System</button>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700/30">
            <div>
              <p className="text-slate-900 dark:text-white font-bold text-sm flex items-center gap-2">Desktop Notifications {notificationPermission === 'granted' && <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 rounded border border-green-500/30">ON</span>}{notificationPermission === 'denied' && <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 rounded border border-red-500/30">BLOCKED</span>}</p>
              <p className="text-xs text-slate-500">Get notified for new tasks</p>
            </div>
            <div className="flex items-center gap-3">
              {notificationPermission === 'granted' && <button onClick={sendTestNotification} className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition">🔔 Test</button>}
              <div onClick={requestNotificationPermission} className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 ${notificationPermission === 'granted' ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-600'}`}><div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow transition-all duration-300 ${notificationPermission === 'granted' ? 'left-6' : 'left-1'}`} /></div>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center pt-10">
        <button onClick={handleLogout} className="text-red-500 hover:text-red-600 text-sm hover:underline font-bold">Sign Out</button>
      </div>
      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
    </div>
  );
}