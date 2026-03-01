'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function ImageUploader() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // サーバーに送るデータを作る
    const formData = new FormData();
    formData.append('file', file);

    try {
      // APIに送信
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.success) {
        setUploadedUrl(data.url); // 成功したらURLをセット
      } else {
        alert('アップロード失敗');
      }
    } catch (e) {
      console.error(e);
      alert('エラーが発生しました');
    }
  }, []);

  // ドロップゾーンの設定
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="p-4 border rounded max-w-md mx-auto mt-4 bg-white text-black shadow-sm">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed p-10 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="font-bold text-blue-500">ここにドロップ！</p>
        ) : (
          <p className="text-gray-600">画像をドラッグ＆ドロップ<br/>またはクリックして選択</p>
        )}
      </div>

      {uploadedUrl && (
        <div className="mt-4 text-center">
          <p className="mb-2 font-bold text-green-600">アップロード完了！</p>
          <img src={uploadedUrl} alt="Uploaded" className="max-w-full h-auto rounded shadow" />
        </div>
      )}
    </div>
  );
}