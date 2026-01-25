"use client";
import NewMemberModal from "@/components/admin/NewMemberModal";
import MemberCard from "@/components/admin/members/MemberCard";
import { useAdminMembers } from "@/hooks/useAdminMembers";

export default function MembersPage() {
  const { members, isModalOpen, setIsModalOpen, loading, fetchMembers } = useAdminMembers();

  // ★修正: 外側のLayoutラッパーやSidebarコンポーネントを削除
  return (
    <div className="p-8 h-full overflow-y-auto no-scrollbar flex flex-col">
      <header className="flex justify-between items-end mb-10 shrink-0">
        <div>
          <h2 className="text-xs text-cyan-500 font-bold tracking-widest mb-1">MANAGEMENT</h2>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">MEMBER LIST</h1>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(34,211,238,0.4)] transition">
          + Add New Member
        </button>
      </header>

      {loading && <div className="text-center text-cyan-500 animate-pulse mt-20">Loading members...</div>}

      {!loading && members.length === 0 && (
        <div className="text-center text-slate-500 mt-20 border-2 border-dashed border-slate-700 rounded-xl p-10">
          <p>No members found.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>

      <NewMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdded={fetchMembers} />
    </div>
  );
}