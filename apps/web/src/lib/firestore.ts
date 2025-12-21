import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  getDocs,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

export const createDocument = async (
  collectionName: string,
  documentId: string,
  data: DocumentData
): Promise<string> => {
  try {
    await setDoc(doc(db, collectionName, documentId), data);
    return documentId;
  } catch (error) {
    throw new Error(`Failed to create document: ${error}`);
  }
};

export const getDocument = async (
  collectionName: string,
  documentId: string
): Promise<DocumentData | null> => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, documentId));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw new Error(`Failed to get document: ${error}`);
  }
};

export const updateDocument = async (
  collectionName: string,
  documentId: string,
  data: DocumentData
): Promise<string> => {
  try {
    await updateDoc(doc(db, collectionName, documentId), data);
    return documentId;
  } catch (error) {
    throw new Error(`Failed to update document: ${error}`);
  }
};

export const deleteDocument = async (collectionName: string, documentId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
    return true;
  } catch (error) {
    throw new Error(`Failed to delete document: ${error}`);
  }
};

export const queryDocuments = async (
  collectionName: string,
  constraints: QueryConstraint[]
): Promise<DocumentData[]> => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((docSnap: QueryDocumentSnapshot<DocumentData>) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    throw new Error(`Failed to query documents: ${error}`);
  }
};
