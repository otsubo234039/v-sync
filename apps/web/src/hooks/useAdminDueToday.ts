import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, updateDoc, doc } from "firebase/firestore";
import { AdminTask } from "@/models/AdminTask";

export const useAdminDueToday = () => {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    try {
      const q = query(collection(db, "admin_tasks"));
      const snapshot = await getDocs(q);
      const today = new Date().toLocaleDateString();

      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as AdminTask))
        .filter(t => {
          if (!t.deadline) return false;
          // 期限が今日 かつ 完了していないもの
          const dDate = new Date(t.deadline.seconds * 1000);
          return dDate.toLocaleDateString() === today && t.status !== 'done';
        });

      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleComplete = async (taskId: string) => {
    if(!confirm("完了にしますか？")) return;
    try {
      await updateDoc(doc(db, "admin_tasks", taskId), { status: 'done' });
      fetchTasks(); // リロード
    } catch (e) {
      console.error(e);
    }
  };

  return {
    tasks,
    loading,
    handleComplete
  };
};