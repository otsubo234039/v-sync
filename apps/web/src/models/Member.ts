import { Timestamp } from "firebase/firestore";

export type Member = {
  id: string;
  name: string;
  generation: string; // e.g., "1期生"
  color: string;      // e.g., "#FF0000"
  status: 'active' | 'graduated' | 'hiatus';
  createdAt: Timestamp;
};