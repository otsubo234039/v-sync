export type Asset = {
  id: number;
  title: string;
  type: 'image' | 'video' | 'audio' | 'file';
  category: string;
  size: string;
  date: string;
  url: string;
  description?: string;
  requiredRole?: 'admin' | 'staff' | 'all';
};

export const MOCK_ASSETS: Asset[] = [
  { id: 1, title: "3周年キービジュアル_最終稿", type: "image", category: "art", size: "12.5 MB", date: "2024-12-20", url: "https://picsum.photos/seed/vtuber1/800/600", description: "3周年記念ライブのメインビジュアルです。", requiredRole: 'all' },
  { id: 2, title: "新衣装_三面図_設定資料", type: "image", category: "character", size: "4.2 MB", date: "2024-11-15", url: "https://picsum.photos/seed/vtuber2/600/800", description: "新衣装の背面・側面資料です。", requiredRole: 'staff' },
  { id: 3, title: "雑談配信BGM_v2.mp3", type: "audio", category: "bgm", size: "8.1 MB", date: "2024-10-01", url: "", description: "雑談配信用のループBGM。", requiredRole: 'all' },
  { id: 6, title: "待機画面ループ動画.mp4", type: "video", category: "video", size: "150 MB", date: "2024-12-25", url: "https://picsum.photos/seed/vtuber4/800/600", description: "配信開始前の待機画面用動画素材。", requiredRole: 'all' },
  { id: 5, title: "ガイドライン規定書.pdf", type: "file", category: "doc", size: "540 KB", date: "2024-08-05", url: "", description: "ガイドライン。", requiredRole: 'all' },
];