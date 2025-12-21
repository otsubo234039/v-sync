import { ref, uploadBytes, getBytes, deleteObject, listAll } from 'firebase/storage';
import { storage } from './firebase';

export const uploadFile = async (path: string, file: File) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return snapshot.ref.fullPath;
  } catch (error) {
    throw new Error(`Failed to upload file: ${error}`);
  }
};

export const downloadFile = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    const bytes = await getBytes(storageRef);
    return bytes;
  } catch (error) {
    throw new Error(`Failed to download file: ${error}`);
  }
};

export const deleteFile = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete file: ${error}`);
  }
};

export const listFiles = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    return {
      files: result.items.map((item) => item.name),
      folders: result.prefixes.map((prefix) => prefix.name),
    };
  } catch (error) {
    throw new Error(`Failed to list files: ${error}`);
  }
};
