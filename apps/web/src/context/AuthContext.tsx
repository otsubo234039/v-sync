"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "firebase/auth";
import { AuthService } from "@/services/authService";

// 管理者のメールアドレス
const ADMIN_EMAIL = "harutsugu.0528@gmail.com";

type AuthContextType = {
  user: User | null;
  role: "admin" | "staff" | null; // ★ roleを追加
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "staff" | null>(null); // ★ roleステート
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onStateChange((currentUser) => {
      setUser(currentUser);
      
      // ★ ユーザーがいたらロールを判定
      if (currentUser) {
        if (currentUser.email === ADMIN_EMAIL) {
          setRole("admin");
        } else {
          setRole("staff");
        }
      } else {
        setRole(null);
      }
      
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);