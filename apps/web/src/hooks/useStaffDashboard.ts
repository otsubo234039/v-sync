import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const ADMIN_EMAIL = "harutsugu.0528@gmail.com";

export const useStaffDashboard = () => {
  const { user, loading } = useAuth();
  const { themeMode, backgroundStyle, baseTextColor } = useTheme();
  const router = useRouter();

  // モーダル表示状態
  const [showSystemModal, setShowSystemModal] = useState(false);
  
  // 時計の状態 (Hydrationエラー防止のため初期値null)
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // 管理者かどうか
  const isAdmin = user?.email === ADMIN_EMAIL;

  // 時計を動かす
  useEffect(() => {
    setCurrentTime(new Date()); // マウント後にセット
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 日付文字列の作成
  const dateStr = currentTime ? currentTime.toLocaleDateString() : "...";
  const timeStr = currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "...";

  // 管理画面への遷移
  const handleSystemSuccess = () => {
    router.push('/admin/dashboard');
  };

  return {
    user,
    loading,
    themeMode,
    backgroundStyle,
    baseTextColor,
    isAdmin,
    showSystemModal,
    setShowSystemModal,
    handleSystemSuccess,
    dateStr,
    timeStr
  };
};