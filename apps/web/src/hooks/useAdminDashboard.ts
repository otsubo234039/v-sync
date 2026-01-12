import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { AdminTask } from "@/models/AdminTask";
import { Schedule } from "@/models/Schedule"; // Staffで作ったモデルを再利用！

export const useAdminDashboard = () => {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  
  const [adminTasks, setAdminTasks] = useState<AdminTask[]>([]);
  const [todayStreamsCount, setTodayStreamsCount] = useState(0); 
  const [dueTodayCount, setDueTodayCount] = useState(0);       
  const [isLiveCount, setIsLiveCount] = useState(0);           

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AdminTask | null>(null);

  // ヘルパー: 日付一致判定
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const fetchDashboardData = useCallback(async () => {
    if (role !== "admin") return;
    try {
      const today = new Date();

      // 1. タスク取得 & 集計
      const tasksQ = query(collection(db, "admin_tasks"), orderBy("createdAt", "desc"));
      const tasksSnapshot = await getDocs(tasksQ);
      const tasksData = tasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminTask[];
      setAdminTasks(tasksData);

      // 当日締切タスクのカウント
      const dueCount = tasksData.filter(t => {
        if (!t.deadline || t.status === 'done') return false;
        const d = new Date(t.deadline.seconds * 1000);
        return isSameDay(d, today);
      }).length;
      setDueTodayCount(dueCount);

      // 2. スケジュール取得 & 集計
      const schedQ = query(collection(db, "schedules"));
      const schedSnapshot = await getDocs(schedQ);
      
      let streamsToday = 0;
      let liveNow = 0;

      schedSnapshot.docs.forEach(doc => {
        const d = doc.data() as Schedule;
        const start = d.startAt instanceof Timestamp ? d.startAt.toDate() : new Date(d.startAt);
        const end = d.endAt instanceof Timestamp ? d.endAt.toDate() : new Date(d.endAt);

        // 今日の配信枠数
        if (d.type === 'stream' && isSameDay(start, today)) {
          streamsToday++;
        }
        // 現在放送中かどうか
        if (d.type === 'stream' && today >= start && today <= end) {
          liveNow++;
        }
      });

      setTodayStreamsCount(streamsToday);
      setIsLiveCount(liveNow);

    } catch (error) {
      console.error(error);
    }
  }, [role]);

  // 権限チェックと初期データロード
  useEffect(() => {
    if (!loading && role !== "admin") {
      router.push("/");
    } else {
      fetchDashboardData();
    }
  }, [loading, role, router, fetchDashboardData]);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleCardClick = (task: AdminTask) => {
    setSelectedTask(task);
  };

  return {
    user,
    loading,
    role,
    adminTasks,
    todayStreamsCount,
    dueTodayCount,
    isLiveCount,
    isModalOpen,
    setIsModalOpen,
    selectedTask,
    setSelectedTask,
    fetchDashboardData,
    navigateTo,
    handleCardClick
  };
};