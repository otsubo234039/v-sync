import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, writeBatch, doc, Timestamp } from "firebase/firestore";
import { Member } from "@/models/Member";

export const useAdminMembersManager = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // メンバー取得
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "members"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Member[];
      setMembers(data);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  // デモデータ追加
  const addDemoMembers = async () => {
    if(!confirm("デモメンバー（3名）を追加しますか？")) return;
    try {
      const batch = writeBatch(db);
      const demos = [
        { name: "月ノ美兎", generation: "1期生", status: "active", color: "#ef4444" },
        { name: "剣持刀也", generation: "2期生", status: "active", color: "#a855f7" },
        { name: "葛葉", generation: "Gamers", status: "active", color: "#ef4444" },
      ];
      demos.forEach(d => {
        const newRef = doc(collection(db, "members"));
        batch.set(newRef, { ...d, createdAt: Timestamp.now() });
      });
      await batch.commit();
      fetchMembers();
      alert("デモメンバーを追加しました！");
    } catch (error) { console.error(error); alert("エラー"); }
  };

  useEffect(() => { fetchMembers(); }, []);

  return {
    members,
    isModalOpen,
    setIsModalOpen,
    loading,
    fetchMembers,
    addDemoMembers
  };
};