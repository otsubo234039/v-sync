import { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Asset, MOCK_ASSETS } from "@/models/Asset";

export const useStaffAssets = () => {
  const { loading } = useAuth();
  const { backgroundStyle, baseTextColor, themeMode } = useTheme();

  // 状態管理
  const [filter, setFilter] = useState<'all' | 'image' | 'audio' | 'file'>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [deniedId, setDeniedId] = useState<number | null>(null);

  // フィルタリングロジック
  const filteredAssets = useMemo(() => {
    return MOCK_ASSETS.filter(asset => {
      const matchesFilter = filter === 'all' 
        ? true 
        : filter === 'image' 
          ? (asset.type === 'image' || asset.type === 'video') 
          : filter === 'audio' 
            ? asset.type === 'audio' 
            : asset.type === 'file';
      
      const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchTerm]);

  // クリック時の処理 (権限チェック含む)
  const handleAssetClick = (asset: Asset) => {
    if (asset.requiredRole === 'admin') { 
       setDeniedId(asset.id);
       setTimeout(() => setDeniedId(null), 500); // 0.5秒後に振動リセット
       return;
    }
    setSelectedAsset(asset);
  };

  return {
    loading,
    backgroundStyle,
    baseTextColor,
    themeMode,
    filter, setFilter,
    searchTerm, setSearchTerm,
    selectedAsset, setSelectedAsset,
    deniedId,
    filteredAssets,
    handleAssetClick
  };
};