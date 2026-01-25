"use client";
import { useState, useEffect } from "react";
import GeneralSettings from "@/components/admin/settings/GeneralSettings";
import MembersManager from "@/components/admin/settings/MembersManager";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "members">("general");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // ★修正: 外側の <div flex...> や <Sidebar /> をすべて削除し、
  // コンテンツ部分 (<header>以降) だけを返します。
  return (
    <div className="p-8 h-full overflow-hidden flex flex-col">
      <header className="mb-8 shrink-0">
        <h2 className="text-xs font-bold tracking-widest mb-1 text-slate-500">CONFIGURATION</h2>
        <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">SETTINGS</h1>
      </header>
      
      <div className="flex gap-6 border-b border-slate-200 dark:border-slate-800 mb-6 shrink-0">
        <button 
          onClick={() => setActiveTab("general")} 
          className={`pb-3 text-sm font-bold transition ${activeTab === "general" ? "text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-600 dark:border-cyan-400" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
        >
          ⚙️ GENERAL
        </button>
        <button 
          onClick={() => setActiveTab("members")} 
          className={`pb-3 text-sm font-bold transition ${activeTab === "members" ? "text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-600 dark:border-cyan-400" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
        >
          👥 MEMBERS
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {activeTab === "general" && <GeneralSettings />}
        {activeTab === "members" && <MembersManager />}
      </div>
    </div>
  );
}