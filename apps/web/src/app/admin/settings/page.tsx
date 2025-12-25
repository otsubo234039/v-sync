// src/app/admin/settings/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, writeBatch, doc, Timestamp } from "firebase/firestore"; // writeBatch等追加
import { useTheme } from "next-themes";

import Sidebar from "@/components/admin/Sidebar";
import NewMemberModal from "@/components/admin/NewMemberModal";
import EditProfileModal from "@/components/admin/EditProfileModal";
import { Member } from "../../../types";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "members">("general");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-slate-200 font-sans relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-10 dark:opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)'
          }}
        />
      </div>
      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        <main className="flex-1 p-8 h-screen overflow-hidden flex flex-col">
          <header className="mb-8 shrink-0">
            <h2 className="text-xs text-slate-500 font-bold tracking-widest mb-1">CONFIGURATION</h2>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">SETTINGS</h1>
          </header>
          <div className="flex gap-6 border-b border-slate-300 dark:border-slate-700/50 mb-6 shrink-0">
            <button onClick={() => setActiveTab("general")} className={`pb-3 text-sm font-bold transition ${activeTab === "general" ? "text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-600 dark:border-cyan-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>⚙️ GENERAL</button>
            <button onClick={() => setActiveTab("members")} className={`pb-3 text-sm font-bold transition ${activeTab === "members" ? "text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-600 dark:border-cyan-400" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>👥 MEMBERS</button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {activeTab === "general" && <GeneralSettings />}
            {activeTab === "members" && <MembersManager />}
          </div>
        </main>
      </div>
    </div>
  );
}

function GeneralSettings() {
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

function MembersManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "members"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Member[];
      setMembers(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  // ★ デモメンバー追加機能
  const addDemoMembers = async () => {
    if(!confirm("デモメンバー（3名）を追加しますか？")) return;
    try {
      const batch = writeBatch(db);
      const demos = [
        { name: "月ノ美兎", generation: "1期生", status: "active", color: "#ef4444" },
        { name: "剣持刀也", generation: "2期生", status: "active", color: "#a855f7" },
        { name: "葛葉", generation: "Gamers", status: "active", color: "#ef4444" },
      ];
      demos.forEach(d => {
        const newRef = doc(collection(db, "members"));
        batch.set(newRef, { ...d, createdAt: Timestamp.now() });
      });
      await batch.commit();
      fetchMembers();
      alert("デモメンバーを追加しました！");
    } catch (error) { console.error(error); alert("エラー"); }
  };

  useEffect(() => { fetchMembers(); }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Member List</h3>
        <div className="flex gap-2">
          {/* ★デモボタン追加 */}
          <button onClick={addDemoMembers} className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2 rounded font-bold transition text-xs">🧪 Demo</button>
          <button onClick={() => setIsModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded font-bold shadow-lg transition text-sm flex items-center gap-2"><span>+</span> Add Member</button>
        </div>
      </div>
      {loading && <div className="text-center text-cyan-500 animate-pulse mt-10">Loading members...</div>}
      {!loading && members.length === 0 && <div className="text-center text-slate-500 mt-10 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-10"><p>No members found.</p></div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
        {members.map((member) => (
          <div key={member.id} className="group relative bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 overflow-hidden hover:border-cyan-400 dark:hover:border-white/20 transition duration-300 cursor-pointer shadow-sm dark:shadow-none">
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${member.color}, transparent)` }} />
            <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-[50px] opacity-10 group-hover:opacity-30 transition" style={{ backgroundColor: member.color }} />
            <div className="flex items-center gap-4 mb-3 relative z-10">
              <div className="w-12 h-12 rounded-full p-[2px]" style={{ background: `linear-gradient(135deg, ${member.color}, rgba(255,255,255,0.2))` }}>
                <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center font-bold text-slate-700 dark:text-white">{member.name.charAt(0)}</div>
              </div>
              <div><h3 className="font-bold text-slate-900 dark:text-white">{member.name}</h3><p className="text-xs text-slate-500 dark:text-slate-400">{member.generation}</p></div>
            </div>
            <div className="flex justify-between items-center text-[10px] relative z-10">
              <span className={`px-2 py-0.5 rounded border ${member.status === 'active' ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400' : member.status === 'graduated' ? 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-500' : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'}`}>{member.status.toUpperCase()}</span>
              <span className="text-slate-400 dark:text-slate-600 font-mono">ID: {member.id.slice(0, 4)}</span>
            </div>
          </div>
        ))}
      </div>
      <NewMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdded={fetchMembers} />
    </div>
  );
}