"use client";
import NewMemberModal from "@/components/admin/NewMemberModal";
import { useAdminMembersManager } from "@/hooks/useAdminMembersManager";

export default function MembersManager() {
  const { members, isModalOpen, setIsModalOpen, loading, fetchMembers, addDemoMembers } = useAdminMembersManager();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Member List</h3>
        <div className="flex gap-2">
          {/* ボタンのデザインも統一 */}
          <button onClick={addDemoMembers} className="bg-white dark:bg-transparent text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg font-bold transition text-xs hover:bg-slate-50 dark:hover:bg-slate-900">🧪 Demo</button>
          <button onClick={() => setIsModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg transition text-xs flex items-center gap-2"><span>+</span> Add Member</button>
        </div>
      </div>
      
      {loading && <div className="text-center text-cyan-500 animate-pulse mt-10">Loading members...</div>}
      
      {!loading && members.length === 0 && (
        <div className="text-center text-slate-500 mt-10 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-10">
          <p>No members found.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
        {members.map((member) => (
          // ★修正: dark:bg-transparent + dark:border-slate-800 (GeneralSettingsと統一)
          <div key={member.id} className="group relative bg-white dark:bg-transparent border border-slate-200 dark:border-slate-800 rounded-xl p-5 overflow-hidden hover:border-cyan-400 dark:hover:border-slate-600 transition duration-300 cursor-pointer shadow-sm">
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: `linear-gradient(90deg, ${member.color}, transparent)` }} />
            <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-[50px] opacity-10 group-hover:opacity-30 transition" style={{ backgroundColor: member.color }} />
            
            <div className="flex items-center gap-4 mb-3 relative z-10">
              {/* アイコン枠線も統一 */}
              <div className="w-12 h-12 rounded-full p-[2px]" style={{ background: `linear-gradient(135deg, ${member.color}, rgba(255,255,255,0.1))` }}>
                <div className="w-full h-full bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center font-bold text-slate-700 dark:text-white">{member.name.charAt(0)}</div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{member.generation}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[10px] relative z-10">
              <span className={`px-2 py-0.5 rounded border ${
                member.status === 'active' 
                  ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400' 
                  : member.status === 'graduated' 
                  ? 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500' 
                  : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
              }`}>
                {member.status.toUpperCase()}
              </span>
              <span className="text-slate-400 dark:text-slate-600 font-mono">ID: {member.id.slice(0, 4)}</span>
            </div>
          </div>
        ))}
      </div>
      <NewMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdded={fetchMembers} />
    </div>
  );
}