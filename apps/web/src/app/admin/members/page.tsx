"use client";
import Sidebar from "@/components/admin/Sidebar";
import NewMemberModal from "@/components/admin/NewMemberModal";
import MemberCard from "@/components/admin/members/MemberCard";
import { useAdminMembers } from "@/hooks/useAdminMembers";

export default function MembersPage() {
  const {
    members,
    isModalOpen,
    setIsModalOpen,
    loading,
    fetchMembers
  } = useAdminMembers();

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
              <MemberCard key={member.id} member={member} />
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