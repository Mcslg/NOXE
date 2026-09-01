import React, { useState } from 'react';
import { RotateCcw, ArrowRight, Lightbulb } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export const RetestSession: React.FC = () => {
  const { session, submitRetestAnswer, isLoading } = useStudy();
  const [currentAnswer, setCurrentAnswer] = useState('');

  if (!session) return null;

  const pendingRetestCards = session.cards.filter(c => c.status === 'needs_retest' && !c.isRetested);
  const currentCard = pendingRetestCards[0];

  if (!currentCard) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || isLoading) return;
    submitRetestAnswer(currentCard.id, currentAnswer.trim());
    setCurrentAnswer('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* 標題指示 */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-amber-950">
                Session 尾聲：弱點觀念重新回想
              </h2>
              <span className="text-xs bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                剩餘 {pendingRetestCards.length} 題
              </span>
            </div>
            <p className="text-xs text-amber-700 mt-1">
              剛才這題您曾求助專家模式。現在請嘗試<strong>用您自己的話</strong>重新講述這個概念，鞏固長期記憶！
            </p>
          </div>
        </div>
      </div>

      {/* 問題卡片 */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            🎓
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">需重新掌握的問題</span>
            <h3 className="text-base font-bold text-slate-800 mt-0.5">
              「{currentCard.question}」
            </h3>
          </div>
        </div>

        {/* 專家曾給的提示重點（可選摺疊或摘要） */}
        {currentCard.expertSolution && (
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-700 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              專家解法核心摘要回顧：
            </div>
            <p className="italic">{currentCard.expertSolution.summary}</p>
          </div>
        )}

        {/* 重新作答區 */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <label className="block text-xs font-bold text-slate-700">
            請用自己的話重新教一次（自己的話輸出才是真正的掌握）：
          </label>
          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="例如：這個機制的本質是...，因為如果沒有它就會導致...。"
            rows={4}
            disabled={isLoading}
            className="w-full p-3.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all resize-none"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              回答完成後即完成本卡重測
            </span>
            <button
              type="submit"
              disabled={isLoading || !currentAnswer.trim()}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-xl flex items-center gap-1.5 shadow-sm transition-all text-xs"
            >
              <span>{pendingRetestCards.length > 1 ? '提交並測下一題' : '完成重測並產出筆記'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
