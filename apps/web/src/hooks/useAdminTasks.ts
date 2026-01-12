import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, writeBatch, doc, Timestamp } from "firebase/firestore";
import { AdminTask } from "@/models/AdminTask";

export const useAdminTasks = () => {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<AdminTask | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const q = query(collection(db, "admin_tasks"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AdminTask[];
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // デモタスク追加機能
  const addDemoTasks = async () => {
    if(!confirm("デモタスクを追加しますか？")) return;
    try {
      const batch = writeBatch(db);
      
      const today = new Date();
      const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
      const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
      const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);

      const demoTasks = [
        { title: "3期生オーディション面接", status: "doing", priority: "high", deadline: tomorrow },
        { title: "夏祭りボイス台本チェック", status: "todo", priority: "medium", deadline: nextWeek },
        { title: "サーバー負荷テスト", status: "done", priority: "low", deadline: yesterday },
        { title: "コラボグッズ入稿データ確認", status: "todo", priority: "high", deadline: today }, 
      ];

      demoTasks.forEach(t => {
        const newRef = doc(collection(db, "admin_tasks"));
        batch.set(newRef, { 
          title: t.title,
          status: t.status, 
          priority: t.priority, 
          deadline: Timestamp.fromDate(t.deadline), 
          createdAt: Timestamp.now(), 
          assigneeId: "demo_user",
          description: "デモデータとして生成されたタスクです。"
        });
      });

      await batch.commit();
      fetchTasks();
      alert("デモタスクを追加しました！");
    } catch (error) { console.error(error); alert("エラーが発生しました"); }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isModalOpen,
    setIsModalOpen,
    selectedTask,
    setSelectedTask,
    fetchTasks,
    addDemoTasks
  };
};