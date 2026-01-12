import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, addDoc, Timestamp, getDocs } from "firebase/firestore";
import { Message, ChatRoom, GROUP_ROOMS } from "@/models/Chat";

export const useStaffChat = () => {
  const { user, loading } = useAuth();
  const { backgroundStyle, baseTextColor, themeMode } = useTheme();

  const [selectedRoomId, setSelectedRoomId] = useState<string>("general");
  const [selectedRoomName, setSelectedRoomName] = useState<string>("General");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [members, setMembers] = useState<ChatRoom[]>([]);
  const [activeTab, setActiveTab] = useState<'groups' | 'direct'>('groups');

  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. メンバーリスト取得
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const q = query(collection(db, "members"));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          type: 'direct' as const,
          icon: doc.data().name.charAt(0)
        }));
        setMembers(data);
      } catch (e) { console.error(e); }
    };
    fetchMembers();
  }, []);

  // 2. メッセージ取得
  useEffect(() => {
    const q = query(
      collection(db, "staff_chats"),
      where("roomId", "==", selectedRoomId),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    });
    return () => unsubscribe();
  }, [selectedRoomId]);

  // 3. 自動スクロール
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 送信処理
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    try {
      await addDoc(collection(db, "staff_chats"), {
        text: newMessage,
        senderName: user.displayName || "Staff",
        senderId: user.uid,
        roomId: selectedRoomId,
        createdAt: Timestamp.now(),
      });
      setNewMessage("");
    } catch (error) { console.error(error); }
  };

  const handleSelectDM = (member: ChatRoom) => {
    if (!user) return;
    const ids = [user.uid, member.id].sort();
    const dmRoomId = `${ids[0]}_${ids[1]}`;
    setSelectedRoomId(dmRoomId);
    setSelectedRoomName(member.name);
  };

  const handleSelectRoom = (room: ChatRoom) => {
      setSelectedRoomId(room.id);
      setSelectedRoomName(room.name);
  }

  return {
    user,
    loading,
    themeMode,
    backgroundStyle,
    baseTextColor,
    selectedRoomId,
    selectedRoomName,
    messages,
    newMessage,
    setNewMessage,
    members,
    activeTab,
    setActiveTab,
    scrollRef,
    handleSendMessage,
    handleSelectDM,
    handleSelectRoom,
    GROUP_ROOMS // Viewでも使うのでエクスポート
  };
};