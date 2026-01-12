import { Timestamp } from "firebase/firestore";

export type AdminTask = {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
  priority: 'high' | 'medium' | 'low';
  assignee?: string;
  deadline?: Timestamp;
  description?: string;
  createdAt: Timestamp;
};