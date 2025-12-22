import { Timestamp } from "firebase/firestore";

// 配信スケジュール用の型
export type Schedule = {
  id: string;
  userId: string;
  type: string;
  title: string;
  startAt: Timestamp;
  endAt: Timestamp;
  status: string;
};

// ★ここを追加！：管理者タスク用の型
export type AdminTask = {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
  priority: "low" | "medium" | "high";
  deadline?: Timestamp; // 期限はあってもなくてもいい（?）
  assigneeId?: string;
  createdAt: Timestamp;
};

export type Member = {
  id: string;
  name: string;
  generation: string; // "1期生", "ゲーマーズ" など
  status: "active" | "resting" | "graduated"; // 活動中 / 休止中 / 卒業
  color: string; // テーマカラー (Tailwindのクラス名)
  channelUrl?: string; // YouTube等のURL（任意）
};