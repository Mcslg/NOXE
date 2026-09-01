import React, { useState } from 'react';
import { BookOpen, Key, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { ApiKeyModal } from './ApiKeyModal';

export const Header: React.FC = () => {
  const { apiKey, session, resetSession } = useStudy();
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          onClick={session ? () => { if (confirm('確定要結束目前學習階段並回到首頁嗎？')) resetSession(); } : undefined}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
              QsToNote
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">費曼問答複習系統</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {session && (
            <button
              onClick={() => {
                if (confirm('確定要重設目前進度並開啟新主題嗎？')) {
                  resetSession();
                }
              }}
              className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              重新開始
            </button>
          )}

          <button
            onClick={() => setIsKeyModalOpen(true)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              apiKey
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-xs'
                : 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-md shadow-amber-500/20 animate-bounce'
            }`}
          >
            {apiKey ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>API Key 已設定</span>
              </>
            ) : (
              <>
                <Key className="w-3.5 h-3.5 text-white" />
                <span>設定 Gemini API Key</span>
              </>
            )}
          </button>
        </div>
      </div>

      <ApiKeyModal isOpen={isKeyModalOpen} onClose={() => setIsKeyModalOpen(false)} />
    </header>
  );
};
