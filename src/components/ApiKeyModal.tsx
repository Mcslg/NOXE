import React, { useState } from 'react';
import { Key, ExternalLink, X, Check } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setApiKey, selectedModel, setSelectedModel } = useStudy();
  const [inputKey, setInputKey] = useState(apiKey);
  const [model, setModel] = useState(selectedModel || 'gemini-1.5-flash-latest');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiKey(inputKey.trim());
    setSelectedModel(model);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">設定 Gemini API Key</h3>
            <p className="text-xs text-slate-500">金鑰僅存於瀏覽器本地，安全不經任何第三方伺服器</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              選擇 Gemini 模型
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none bg-white transition-all"
            >
              <option value="gemini-1.5-flash-latest">gemini-1.5-flash-latest (推薦)</option>
              <option value="gemini-2.0-flash">gemini-2.0-flash (最新快速)</option>
              <option value="gemini-1.5-flash">gemini-1.5-flash</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro (深度推理)</option>
              <option value="gemini-pro">gemini-pro (經典)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">系統已內建自動容錯機制，若指定模型無法存取將自動切換備用模型。</p>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl text-xs text-slate-600 space-y-1.5 border border-slate-100">
            <div className="font-medium text-slate-700">如何免費獲取 API Key？</div>
            <p>1. 前往 Google AI Studio 建立或登入帳號。</p>
            <p>2. 點擊「Get API key」並建立免費金鑰。</p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline pt-1 font-medium"
            >
              前往 Google AI Studio 申請 <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" /> 已儲存
                </>
              ) : (
                '儲存設定'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
