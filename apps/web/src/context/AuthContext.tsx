// src/context/AuthContext.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, db } from "@/lib/firebase"; // さっき作ったfirebase.ts
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// ユーザーの型定義（簡易版）
type UserRole = "admin" | "manager" | "liver" | "listener" | null;

type AuthContextType = {
  user: User | null;       // Firebaseのユーザー情報
  role: UserRole;          // 判明した役割
  loading: boolean;        // 判定中かどうか
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ログイン状態が変わった時の監視
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // ログインしたら、DBのどの箱にいるか探しに行く
        const uid = firebaseUser.uid;
        
        // 並列で4つの箱を一気に検索！（非同期処理の高速化）
        const checks = [
          getDoc(doc(db, "admins", uid)).then(d => d.exists() ? "admin" : null),
          getDoc(doc(db, "managers", uid)).then(d => d.exists() ? "manager" : null),
          getDoc(doc(db, "livers", uid)).then(d => d.exists() ? "liver" : null),
          getDoc(doc(db, "listeners", uid)).then(d => d.exists() ? "listener" : null),
        ];

        const results = await Promise.all(checks);
        // 見つかったロールをセット（全部nullなら未登録）
        const foundRole = results.find(r => r !== null) as UserRole;
        setRole(foundRole || "listener"); // 見つからなければ一旦リスナー扱い
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);