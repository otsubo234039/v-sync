import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/authService"; // 作成したServiceを利用

export const useLoginPage = () => {
  const router = useRouter();
  
  // フォームの状態管理
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Googleログイン処理
  const handleGoogleLogin = async () => {
    try {
      setError("");
      await AuthService.loginWithGoogle();
      // 成功したらダッシュボードへ
      router.push("/staff/dashboard");
    } catch (err: any) {
      console.error("Login failed", err);
      setError("Googleログインエラー: " + err.message);
    }
  };

  // メールログイン処理
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError("");

    try {
      await AuthService.loginWithEmail(email, password);
      // 成功したらダッシュボードへ
      router.push("/staff/dashboard");
    } catch (err: any) {
      setError("ログイン失敗: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Viewに渡すものを返す
  return {
    email, setEmail,
    password, setPassword,
    isLoading,
    error,
    handleGoogleLogin,
    handleEmailLogin
  };
};