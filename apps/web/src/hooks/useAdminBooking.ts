import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, Timestamp, writeBatch, doc } from "firebase/firestore";
import { Booking } from "@/models/Booking";

export const useAdminBooking = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const q = query(collection(db, "bookings"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Booking[];
      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const changeDate = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  // デモデータ投入ロジック
  const addDemoBookings = async () => {
    if(!confirm("今日のデモ予約データを追加しますか？")) return;
    
    try {
      const batch = writeBatch(db);
      const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      const demos = [
        { resourceId: "studio_a", resourceName: "Studio A (3D Live)", applicantName: "月ノ美兎", purpose: "3Dライブ リハーサル", start: "10:00", end: "13:00" },
        { resourceId: "studio_a", resourceName: "Studio A (3D Live)", applicantName: "剣持刀也", purpose: "新衣装3Dお披露目", start: "15:00", end: "17:00" },
        { resourceId: "studio_b", resourceName: "Studio B (Recording)", applicantName: "葛葉", purpose: "歌ってみた収録", start: "13:00", end: "16:00" },
        { resourceId: "booth", resourceName: "Vocal Booth", applicantName: "叶", purpose: "ボイス収録", start: "11:00", end: "12:00" },
        { resourceId: "mocap_suit", resourceName: "Mocap Suit X", applicantName: "運営スタッフ", purpose: "機材メンテナンス", start: "09:00", end: "10:30" },
      ];

      demos.forEach(d => {
        const newRef = doc(collection(db, "bookings"));
        const startDt = new Date(`${todayStr}T${d.start}`);
        const endDt = new Date(`${todayStr}T${d.end}`);

        batch.set(newRef, {
          resourceId: d.resourceId,
          resourceName: d.resourceName,
          applicantName: d.applicantName,
          purpose: d.purpose,
          startAt: Timestamp.fromDate(startDt),
          endAt: Timestamp.fromDate(endDt),
          status: "confirmed",
          createdAt: Timestamp.now(),
        });
      });

      await batch.commit();
      fetchBookings();
      alert("デモ予約を追加しました！");
    } catch (error) {
      console.error(error);
      alert("エラーが発生しました");
    }
  };

  return {
    currentDate,
    bookings,
    isModalOpen,
    setIsModalOpen,
    fetchBookings,
    changeDate,
    addDemoBookings
  };
};