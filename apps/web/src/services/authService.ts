import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  AuthError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; // firebase.tsの場所に合わせて調整してください

// Googleプロバイダーのインスタンス
const googleProvider = new GoogleAuthProvider();

export const AuthService = {
  // メールで登録
  register: async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      throw error as AuthError;
    }
  },

  // メールでログイン
  loginWithEmail: async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      throw error as AuthError;
    }
  },

  // ★追加: Googleでログイン
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      throw error as AuthError;
    }
  },

  // ログアウト
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error as AuthError;
    }
  },

  // 状態監視 (Contextで使用)
  onStateChange: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
  }
};