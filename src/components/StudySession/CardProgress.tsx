import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const CardProgress: React.FC = () => {
  const { session } = useStudy();
  if (!session) return null;

  const total = session.cards.length;
  const current = session.currentCardIndex + 1;
  const retestCount = session.cards.filter(c => c.status === 'needs_retest').length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">目前主題</span>
          <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{session.topic}</h3>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {retestCount > 0 && (
            <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> 待重測: {retestCount}
            </span>
          )}
          <span className="text-slate-500 font-medium">
            卡片 <strong className="text-blue-600 font-bold">{current}</strong> / {total}
          </span>
        </div>
      </div>

      {/* 進度條 */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex gap-1 p-0.5">
        {session.cards.map((card, idx) => {
          let statusColor = 'bg-slate-200';
          if (idx === session.currentCardIndex) {
            statusColor = 'bg-blue-500 animate-pulse';
          } else if (card.status === 'completed') {
            statusColor = 'bg-emerald-500';
          } else if (card.status === 'needs_retest') {
            statusColor = 'bg-amber-500';
          }

          return (
            <div
              key={card.id}
              className={`h-full flex-1 rounded-full transition-all duration-300 ${statusColor}`}
              title={`問題 ${idx + 1}: ${card.question}`}
            />
          );
        })}
      </div>
    </div>
  );
};
