import React from 'react';
import { Award, Lightbulb, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const ExpertModal: React.FC = () => {
  const { session, nextCardAfterExpert } = useStudy();
  if (!session) return null;

  const currentCard = session.cards[session.currentCardIndex];
  if (!currentCard || !currentCard.expertSolution) return null;

  const solution = currentCard.expertSolution;

  const handleUnderstood = () => {
    nextCardAfterExpert();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto relative">
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">專家教學模式</div>
            <h3 className="text-base font-bold text-slate-800">「{currentCard.question}」</h3>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-700">
          {/* 核心總結 */}
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
            <h4 className="text-xs font-bold text-amber-800 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              核心觀念解析：
            </h4>
            <p className="leading-relaxed font-medium text-slate-800">{solution.summary}</p>
          </div>

          {/* 關鍵要點 */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-700 mb-2">重點提要：</h4>
            <ul className="space-y-2">
              {solution.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-slate-600">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 生活比喻 */}
          {solution.analogy && (
            <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200">
              <h4 className="text-xs font-bold text-blue-800 mb-1 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                生活化直覺比喻：
              </h4>
              <p className="text-xs md:text-sm text-blue-950 leading-relaxed italic">
                「{solution.analogy}」
              </p>
            </div>
          )}
        </div>

        {/* 底部按鈕 */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-amber-700 font-medium">
            💡 此卡片已標記為【待重測】，將在所有卡片完成後讓您用自己的話複習。
          </div>
          <button
            type="button"
            onClick={handleUnderstood}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>我讀懂了，前往下一題</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
