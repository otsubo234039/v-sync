"use client";
import { Timestamp } from "firebase/firestore";
import { Booking, Resource } from "@/models/Booking";

type Props = {
  resource: Resource;
  bookings: Booking[];
  dateKey: string; // "YYYY/MM/DD"
  HOURS: number[];
};

export default function BookingTimelineRow({ resource, bookings, dateKey, HOURS }: Props) {
  
  // 位置計算ロジック (View用のヘルパー)
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

  // 表示すべき予約のみフィルタリング
  const resourceBookings = bookings.filter(b => {
    const sDate = b.startAt instanceof Timestamp ? b.startAt.toDate() : new Date(b.startAt);
    return sDate.toLocaleDateString() === dateKey && b.resourceId === resource.id;
  });

  return (
    <div className="flex border-b border-slate-200/50 dark:border-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-800/20 transition group h-[80px]">
      
      {/* 左側：リソース情報 */}
      <div className="w-[180px] shrink-0 bg-slate-50 dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-700/50 z-10 flex flex-col justify-center px-4 group-hover:bg-slate-100 dark:group-hover:bg-[#1E293B] transition-colors">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">
            {resource.type === 'studio' ? '🎙️' : resource.type === 'booth' ? '🎤' : '🕶️'}
          </span>
          <span className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">
            {resource.name}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">{resource.type}</span>
      </div>

      {/* 右側：予約バーエリア */}
      <div className="flex-1 relative h-full">
        {/* グリッド線 */}
        {HOURS.map(h => (
          <div key={h} className="absolute top-0 bottom-0 border-l border-slate-200/50 dark:border-slate-700/10" style={{ left: `${(h / 24) * 100}%` }} />
        ))}

        {/* 予約バー描画 */}
        {resourceBookings.map(booking => {
          const pos = getPositionStyle(booking.startAt, booking.endAt);
          return (
            <div
              key={booking.id}
              className="absolute top-3 bottom-3 rounded-md bg-orange-500/80 dark:bg-orange-600/60 border border-orange-400 dark:border-orange-500/50 text-white text-xs px-2 flex flex-col justify-center overflow-hidden cursor-pointer hover:brightness-110 hover:z-20 z-10 shadow-sm transition-all"
              style={pos}
              title={`${booking.purpose} by ${booking.applicantName}`}
            >
              <span className="font-bold truncate">{booking.applicantName}</span>
              <span className="text-[10px] opacity-80 truncate">{booking.purpose}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}