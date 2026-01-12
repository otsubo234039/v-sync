"use client";
import { Timestamp } from "firebase/firestore";
import { Schedule } from "@/models/Schedule";
import { Member } from "@/models/Member";

type Props = {
  member: Member;
  schedules: Schedule[];
  dateKey: string;
  HOURS: number[];
  onDelete: (s: Schedule) => void;
};

export default function TimelineRow({ member, schedules, dateKey, HOURS, onDelete }: Props) {
  const TOTAL_MINUTES = 1440;

  const getPositionStyle = (start: Timestamp | Date, end: Timestamp | Date) => {
    const startDate = start instanceof Timestamp ? start.toDate() : new Date(start);
    const endDate = end instanceof Timestamp ? end.toDate() : new Date(end);
    
    const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
    const durationMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    
    const leftPercent = (startMinutes / TOTAL_MINUTES) * 100;
    const widthPercent = (durationMinutes / TOTAL_MINUTES) * 100;
    
    return { left: `${leftPercent}%`, width: `${widthPercent}%` };
  };

  // このメンバーの今日のスケジュールを抽出
  const userSchedules = schedules.filter(s => {
    // userIdがない場合(admin schedule等)は除外、もしくはmember.idと一致するもの
    if ((s as any).userId !== member.id) return false;
    
    const sDate = s.startAt instanceof Timestamp ? s.startAt.toDate() : new Date(s.startAt);
    return sDate.toLocaleDateString() === dateKey;
  });

  return (
    <div className="flex border-b border-slate-200/50 dark:border-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-800/20 transition group h-[60px]">
      
      {/* 左側: メンバー情報 */}
      <div className="w-[150px] shrink-0 bg-slate-50 dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-700/50 z-10 flex items-center gap-3 p-3 group-hover:bg-slate-100 dark:group-hover:bg-[#1E293B] transition-colors">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ring-1 ring-white/20" 
          style={{ backgroundColor: member.color, boxShadow: `0 0 10px ${member.color}80` }}
        >
          {member.name.charAt(0)}
        </div>
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{member.name}</span>
      </div>

      {/* 右側: タイムライン */}
      <div className="flex-1 relative h-full">
        {/* グリッド線 */}
        {HOURS.map(h => (
          <div key={h} className="absolute top-0 bottom-0 border-l border-slate-200/50 dark:border-slate-700/10" style={{ left: `${(h / 24) * 100}%` }} />
        ))}

        {/* バー描画 */}
        {userSchedules.map(schedule => {
          const pos = getPositionStyle(schedule.startAt, schedule.endAt);
          
          let barColor = "bg-slate-500 border-slate-400";
          if (schedule.type === "stream") barColor = "bg-red-500/90 border-red-400 shadow-sm";
          if (schedule.type === "meeting") barColor = "bg-blue-500/90 border-blue-400";
          if (schedule.type === "event") barColor = "bg-yellow-500/90 border-yellow-400 text-black/80";

          return (
            <div 
              key={schedule.id} 
              onClick={() => onDelete(schedule)}
              className={`absolute top-2 bottom-2 rounded border ${barColor} text-white text-[10px] px-2 flex items-center overflow-hidden whitespace-nowrap cursor-pointer hover:brightness-110 hover:z-20 z-10 hover:scale-[1.02] transition-transform`} 
              style={pos} 
              title={`${schedule.title} (クリックで削除)`}
            >
              <span className="font-bold drop-shadow-sm truncate">{schedule.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}