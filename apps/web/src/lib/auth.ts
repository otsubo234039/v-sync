import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  AuthError,
} from 'firebase/auth';
import { auth } from './firebase';

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(authError.message);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(authError.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    const authError = error as AuthError;
    throw new Error(authError.message);
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
