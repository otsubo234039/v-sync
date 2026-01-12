import { Timestamp } from "firebase/firestore";

export type Booking = {
  id: string;
  resourceId: string;
  resourceName: string;
  applicantName: string;
  purpose: string;
  startAt: Timestamp | Date;
  endAt: Timestamp | Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Timestamp;
};

export type Resource = {
  id: string;
  name: string;
  type: 'studio' | 'booth' | 'equipment';
};

// リソース定義を一元管理
export const RESOURCES: Resource[] = [
  { id: "studio_a", name: "Studio A (3D Live)", type: "studio" },
  { id: "studio_b", name: "Studio B (Recording)", type: "studio" },
  { id: "booth", name: "Vocal Booth", type: "booth" },
  { id: "mocap_suit", name: "Mocap Suit X", type: "equipment" },
];