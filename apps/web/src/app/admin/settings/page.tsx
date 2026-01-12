"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import GeneralSettings from "@/components/admin/settings/GeneralSettings";
import MembersManager from "@/components/admin/settings/MembersManager";

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