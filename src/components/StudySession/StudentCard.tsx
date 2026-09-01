import React from 'react';
import { MessageCircle, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { StudyCard } from '../../types';

interface StudentCardProps {
  card: StudyCard;
}

export const StudentCard: React.FC<StudentCardProps> = ({ card }) => {
  const isFollowUp = card.status === 'follow_up' && card.studentFeedback;

  return (
    <div className="space-y-4 mb-6 animate-fadeIn">
      {/* 1. 初學者學生提問主卡片 */}
      <div className="bg-white border-2 border-blue-100 rounded-2xl p-5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
        
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 font-bold text-sm shadow-sm">
            🎓 學生
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-600 tracking-wide uppercase">初學者提問</span>
              {card.contextHint && (
                <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">
                  考查核心: {card.contextHint}
                </span>
              )}
            </div>
            <h3 className="text-base md:text-lg font-bold text-slate-800 leading-snug">
              「{card.question}」
            </h3>
          </div>
        </div>
      </div>

      {/* 2. 若為追問輪，展示導師前次回答與學生的反饋/追問 */}
      {isFollowUp && (
        <div className="space-y-3.5 pt-1">
          {/* 導師第 1 輪回答回顧 */}
          {card.userAnswers[0] && (
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm p-4 text-sm max-w-xl shadow-sm leading-relaxed">
                <div className="text-[11px] text-blue-200 font-semibold mb-1">您的初次講解：</div>
                {card.userAnswers[0]}
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
                👨‍🏫
              </div>
            </div>
          )}

          {/* 學生反饋卡片 */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              學生消化與反饋：
            </div>

            {/* 聽懂的點 */}
            {card.studentFeedback?.understood && (
              <div className="flex items-start gap-2 text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-amber-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-700">學生聽懂了：</strong>
                  {card.studentFeedback.understood}
                </div>
              </div>
            )}

            {/* 盲點/未講清處 */}
            {card.studentFeedback?.missingOrConfused && (
              <div className="flex items-start gap-2 text-xs text-slate-700 bg-white/80 p-2.5 rounded-xl border border-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-700">學生仍有困惑/遺漏：</strong>
                  {card.studentFeedback.missingOrConfused}
                </div>
              </div>
            )}

            {/* 學生的追問 */}
            {card.studentFeedback?.followUpQuestion && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  學生追問（請再為他解答 1 次）：
                </div>
                <div className="text-sm font-semibold text-slate-800">
                  「{card.studentFeedback.followUpQuestion}」
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
