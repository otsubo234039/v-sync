import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { Schedule } from "@/models/Schedule";
import { Member } from "@/models/Member";

// スケジュールにメンバー情報を付加した型
export type ScheduleWithMember = Schedule & { member?: Member };

export const useAdminOnAir = () => {
  const [schedules, setSchedules] = useState<ScheduleWithMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. メンバー取得
        const membersSnap = await getDocs(collection(db, "members"));
        const membersMap: Record<string, Member> = {};
        membersSnap.docs.forEach(doc => {
          membersMap[doc.id] = { id: doc.id, ...doc.data() } as Member;
        });

        // 2. スケジュール取得 (今日の分)
        const sSnap = await getDocs(query(collection(db, "schedules"), where("type", "==", "stream")));
        const today = new Date().toLocaleDateString();
        
        const data = sSnap.docs
          .map(doc => {
            const d = doc.data();
            // userIdプロパティがあることを想定（Schedule型にはないのでキャスト時に注意）
            return { id: doc.id, ...d } as any; 
          })
          .filter(s => {
            const sDate = s.startAt instanceof Timestamp ? s.startAt.toDate() : new Date(s.startAt);
            return sDate.toLocaleDateString() === today;
          })
          .map(s => ({
            ...s,
            member: membersMap[s.userId] // userIdで紐付け
          }))
          .sort((a, b) => {
            const tA = a.startAt instanceof Timestamp ? a.startAt.toDate() : new Date(a.startAt);
            const tB = b.startAt instanceof Timestamp ? b.startAt.toDate() : new Date(b.startAt);
            return tA.getTime() - tB.getTime();
          });

        setSchedules(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { schedules, loading };
};