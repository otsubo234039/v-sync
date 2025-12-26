// src/app/admin/members/page.tsx
"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Member } from "../../../types";
import NewMemberModal from "@/components/admin/NewMemberModal";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Firestoreからメンバー取得
  const fetchMembers = async () => {
    try {
      const q = query(collection(db, "members"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Member[];
      setMembers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-200 font-sans relative overflow-hidden">
      
      {/* 背景グリッド */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to bottom, black, transparent)',
          }}
        />
      </div>

      <div className="relative z-10 flex w-full h-full">
        <Sidebar />

        <main className="flex-1 p-8 h-screen overflow-y-auto no-scrollbar">
          <header className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-xs text-cyan-500 font-bold tracking-widest mb-1">MANAGEMENT</h2>
              <h1 className="text-3xl font-bold text-white tracking-tight">MEMBER LIST</h1>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)] transition"
            >
              + Add New Member
            </button>
          </header>

          {/* ローディング表示 */}
          {loading && <div className="text-center text-cyan-500 animate-pulse mt-20">Loading members...</div>}

          {/* メンバーがいない場合 */}
          {!loading && members.length === 0 && (
            <div className="text-center text-slate-500 mt-20 border-2 border-dashed border-slate-800 rounded-xl p-10">
              <p>No members found.</p>
              <p className="text-sm mt-2">Click &quot;Add New Member&quot; to start.</p>
            </div>
          )}

          {/* メンバーグリッド表示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {members.map((member) => (
              <div key={member.id} className="group relative bg-slate-800/50 border border-slate-700 rounded-xl p-6 overflow-hidden hover:border-white/20 transition duration-300 cursor-pointer">
                
                {/* 背景装飾（Hexカラーを使ったグラデーションをstyleで生成） */}
                <div 
                  className="absolute top-0 left-0 w-full h-1" 
                  style={{ background: `linear-gradient(90deg, ${member.color}, transparent)` }}
                />
                
                {/* カード下部の発光エフェクト */}
                <div 
                  className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-10 group-hover:opacity-30 transition"
                  style={{ backgroundColor: member.color }}
                />

                <div className="flex items-center gap-4 mb-4 relative z-10">
                  {/* アイコン枠 */}
                  <div 
                    className="w-14 h-14 rounded-full p-[2px]"
                    style={{ background: `linear-gradient(135deg, ${member.color}, rgba(255,255,255,0.2))` }}
                  >
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-lg text-white">
                      {member.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                    <p className="text-xs text-slate-400">{member.generation}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs relative z-10">
                  <span className={`px-2 py-1 rounded border ${
                    member.status === 'active' 
                      ? 'border-green-500/30 bg-green-500/10 text-green-400' 
                      : member.status === 'graduated'
                      ? 'border-slate-600 bg-slate-800 text-slate-500'
                      : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {member.status.toUpperCase()}
                  </span>
                  <span className="text-slate-600 font-mono">ID: {member.id.slice(0, 4)}</span>
                </div>

              </div>
            ))}
          </div>

        </main>
      </div>

      <NewMemberModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdded={fetchMembers} 
      />
    </div>
  );
}