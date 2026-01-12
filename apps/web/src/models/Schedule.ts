import { Timestamp } from "firebase/firestore";

// UI表示用の型 (Staffカレンダーで使用)
export type CalendarEvent = {
  id: string;
  title: string;
  type: 'studio' | 'meeting' | 'event';
  startAt: Date;
  endAt: Date;
  originalData: any;
};

// ★ 追加: Firestoreデータそのものの型 (Adminダッシュボードで使用)
export type Schedule = {
  id: string;
  title: string;
  type: 'studio' | 'meeting' | 'event' | 'stream'; // streamが含まれるのが特徴
  startAt: Timestamp | Date;
  endAt: Timestamp | Date;
  resourceName?: string; // スタジオ予約の場合など
  applicantName?: string;
};