import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, Timestamp, writeBatch, doc, deleteDoc } from "firebase/firestore";
import { Schedule } from "@/models/Schedule";
import { Member } from "@/models/Member";

export const useAdminTimeline = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // データ取得
  const fetchData = useCallback(async () => {
    try {
      // スケジュール
      const sQ = query(collection(db, "schedules"));
      const sSnap = await getDocs(sQ);
      const sData = sSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Schedule[];
      setSchedules(sData);

      // メンバー
      const mQ = query(collection(db, "members"));
      const mSnap = await getDocs(mQ);
      const mData = mSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Member[];
      setMembers(mData);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 削除機能
  const handleDelete = async (schedule: Schedule) => {
    if(!confirm(`予定「${schedule.title}」を削除しますか？`)) return;
    try {
      await deleteDoc(doc(db, "schedules", schedule.id));
      fetchData();
    } catch (e) { console.error(e); }
  };

  // デモ機能
  const addDemoSchedules = async () => {
    if (members.length === 0) {
      alert("メンバーがいません。先に設定画面(Settings)でメンバーを追加してください。");
      return;
    }
    if(!confirm("今日のデモスケジュールを追加しますか？")) return;
    try {
      const batch = writeBatch(db);
      const todayStr = new Date().toISOString().split("T")[0];
      
      members.forEach((m, i) => {
        const types = ["stream", "meeting", "event"] as const;
        const type = types[i % 3];
        const startHour = 10 + (i * 2) % 10;
        const newRef = doc(collection(db, "schedules"));
        
        batch.set(newRef, {
          userId: m.id,
          title: type === "stream" ? "雑談配信" : type === "meeting" ? "運営MTG" : "新衣装撮影",
          type: type,
          startAt: Timestamp.fromDate(new Date(`${todayStr}T${startHour}:00`)),
          endAt: Timestamp.fromDate(new Date(`${todayStr}T${startHour + 2}:00`)),
          createdAt: Timestamp.now(),
        });
      });
      
      await batch.commit();
      fetchData();
      alert("デモスケジュールを追加しました！");
    } catch (error) { console.error(error); }
  };

  const changeDate = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  return {
    currentDate,
    schedules,
    members,
    isModalOpen,
    setIsModalOpen,
    fetchData,
    handleDelete,
    addDemoSchedules,
    changeDate
  };
};