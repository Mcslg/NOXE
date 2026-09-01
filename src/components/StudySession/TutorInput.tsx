import React, { useState } from 'react';
import { Send, Sparkles, HelpCircle, Wand2, Loader2 } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { expandKeywordsToDraft } from '../../services/gemini';

export const TutorInput: React.FC = () => {
  const { session, submitAnswer, requestExpertHelp, apiKey, isLoading } = useStudy();
  const [answer, setAnswer] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isDraftMode, setIsDraftMode] = useState(false);
  const [isDraftLoading, setIsDraftLoading] = useState(false);

  if (!session) return null;
  const currentCard = session.cards[session.currentCardIndex];
  if (!currentCard) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || isLoading) return;
    submitAnswer(answer.trim());
    setAnswer('');
    setIsDraftMode(false);
    setKeywords('');
  };

  const handleGenerateDraft = async () => {
    if (!keywords.trim() || !apiKey || isDraftLoading) return;
    setIsDraftLoading(true);
    try {
      const draft = await expandKeywordsToDraft(keywords.trim(), currentCard.question, apiKey);
      setAnswer(draft);
      setIsDraftMode(false);
      setKeywords('');
    } catch (err: any) {
      alert(err.message || '生成草稿失敗');
    } finally {
      setIsDraftLoading(false);
    }
  };

  const isFollowUp = currentCard.status === 'follow_up';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* 導師操作模式切換 */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            👨‍🏫 導師回答區
          </span>
          <span className="text-xs text-slate-400">
            {isFollowUp ? '（解答學生的追問）' : '（請用淺白的話引導學生）'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDraftMode(!isDraftMode)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-all ${
              isDraftMode
                ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm'
                : 'text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-600" />
            {isDraftMode ? '收起關鍵字草稿' : '關鍵字輔助'}
          </button>

          <button
            type="button"
            onClick={requestExpertHelp}
            disabled={isLoading}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 font-medium flex items-center gap-1.5 transition-all"
            title="遇到不熟的觀念？讓專家直接為您解析並打上待重測標籤"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            我不會，請教我 (專家模式)
          </button>
        </div>
      </div>

      {/* 關鍵字草稿展開欄 */}
      {isDraftMode && (
        <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-3.5 space-y-2.5 animate-fadeIn">
          <div className="text-xs font-semibold text-purple-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            輸入 2~3 個零散關鍵字或筆記碎片，由 AI 自動轉為教學草稿：
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="例如：SYN、ACK、確認連線、防止舊封包干擾"
              className="flex-1 px-3 py-2 text-xs border border-purple-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-400 bg-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleGenerateDraft();
                }
              }}
            />
            <button
              type="button"
              onClick={handleGenerateDraft}
              disabled={isDraftLoading || !keywords.trim()}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all"
            >
              {isDraftLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> 生成中...
                </>
              ) : (
                '生成草稿'
              )}
            </button>
          </div>
        </div>
      )}

      {/* 回答輸入框 */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={
            isFollowUp
              ? "針對學生的追問補充說明（例如：因為如果沒有最後一步，伺服器就無法確認客戶端是否收到了確認...）"
              : "用你的話教導學生（提示：多用比喻或白話解釋，避免單純堆砌專有名詞）..."
          }
          rows={4}
          disabled={isLoading}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          className="w-full p-3.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none placeholder:text-slate-400"
        />

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>支援快速鍵 <kbd className="px-1.5 py-0.5 bg-slate-100 border rounded text-[10px]">Ctrl / ⌘ + Enter</kbd> 送出</span>
          <button
            type="submit"
            disabled={isLoading || !answer.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-xl flex items-center gap-1.5 shadow-sm transition-all text-xs"
          >
            <span>{isFollowUp ? '送出補充並進入下一題' : '教導學生'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
