import React, { useState } from 'react';
import { Copy, Check, Download, RefreshCw, FileText, Sparkles } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export const NoteSummary: React.FC = () => {
  const { session, resetSession } = useStudy();
  const [isCopied, setIsCopied] = useState(false);

  if (!session || !session.finalNote) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(session.finalNote || '');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([session.finalNote || ''], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${session.topic.replace(/[\\/:*?"<>|]/g, '_')}_費曼學習筆記.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const totalCards = session.cards.length;
  const retestedCards = session.cards.filter(c => c.status === 'needs_retest').length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      {/* 頂部恭喜與摘要 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              教學完成！恭喜掌握主題
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {session.topic}
            </h2>
            <div className="flex items-center gap-4 text-xs text-blue-100 font-medium pt-1">
              <span>完成卡片：{totalCards} 張</span>
              <span>•</span>
              <span>弱點重測：{retestedCards} 題</span>
              <span>•</span>
              <span>已生成結構化筆記</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {isCopied ? '已複製 Markdown' : '複製筆記'}
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2.5 bg-blue-500/40 hover:bg-blue-500/60 text-white border border-white/30 text-xs font-bold rounded-xl backdrop-blur-sm flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              下載 .md
            </button>
          </div>
        </div>
      </div>

      {/* Markdown 筆記預覽區塊 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-base">個人專屬費曼學習筆記</h3>
          </div>
          <span className="text-xs text-slate-400">依據本次問答盲點與重測過程客製化總結</span>
        </div>

        {/* 筆記內文（保持格式） */}
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm md:text-base font-sans whitespace-pre-wrap selection:bg-blue-100">
          {session.finalNote}
        </div>
      </div>

      {/* 底部動作 */}
      <div className="flex justify-center pt-4">
        <button
          onClick={resetSession}
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-xl flex items-center gap-2 shadow-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          複習下一個主題
        </button>
      </div>
    </div>
  );
};
