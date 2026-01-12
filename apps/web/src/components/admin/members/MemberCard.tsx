"use client";
import { Member } from "@/models/Member";

type Props = {
  member: Member;
};

export default function MemberCard({ member }: Props) {
  return (
    <div className="group relative bg-slate-800/50 border border-slate-700 rounded-xl p-6 overflow-hidden hover:border-white/20 transition duration-300 cursor-pointer">
      
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
  );
}