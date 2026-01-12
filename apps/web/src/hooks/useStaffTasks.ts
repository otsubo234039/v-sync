import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, addDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { StaffTask } from "@/models/Task";

export const useStaffTasks = () => {
  const { loading } = useAuth();
  const { backgroundStyle, baseTextColor, themeMode } = useTheme();
  
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const q = query(collection(db, "staff_tasks"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StaffTask)));
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleAddTask = async (data: any) => {
    try {
      await addDoc(collection(db, "staff_tasks"), { ...data, createdAt: Timestamp.now() });
      setIsModalOpen(false);
      fetchTasks();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("削除しますか？")) return;
    try { 
      await deleteDoc(doc(db, "staff_tasks", id)); 
      fetchTasks(); 
    } catch (e) { console.error(e); }
  };

  return {
    loading,
    backgroundStyle,
    baseTextColor,
    themeMode,
    tasks,
    isModalOpen,
    setIsModalOpen,
    handleAddTask,
    handleDelete
  };
};