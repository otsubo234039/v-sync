import { Timestamp } from "firebase/firestore";

export type Message = {
  id: string;
  text: string;
  senderName: string;
  senderId: string;
  createdAt: Timestamp;
  roomId: string;
};

export type ChatRoom = {
  id: string;
  name: string;
  type: 'group' | 'direct';
  icon?: string;
};

export const GROUP_ROOMS: ChatRoom[] = [
  { id: "general", name: "📣 General", type: 'group' },
  { id: "random", name: "☕ Random", type: 'group' },
  { id: "announcements", name: "🚨 Announcements", type: 'group' },
];