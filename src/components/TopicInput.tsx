import React, { useState } from 'react';
import { ArrowRight, Sparkles, GraduationCap, MessageSquareCode, BrainCircuit, FileText } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

const PRESET_TOPICS = [
  'TCP 三向交握與四向揮手原理',
  'JavaScript 閉包 (Closure) 與作用域鏈',
  'React Virtual DOM 與 Diff 算法機制',
  '什麼是 RESTful API 與核心設計原則',
  '快顯機制 (Browser Caching) 與 Cache-Control',
  'Docker 容器與傳統虛擬機器 (VM) 的本質差異'
];

export const TopicInput: React.FC = () => {
  const { startSession, apiKey, isLoading } = useStudy();
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    startSession(topic.trim());
  };

  const handleSelectPreset = (preset: string) => {
    setTopic(preset);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" /> 費曼學習法（以教代學）驅動
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          你來當導師，教懂對面的 AI 學生
        </h2>
        <p className="text-slate-600 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          輸入你想複習或掌握的概念。AI 將化身為初學者學生向你提問與追問，
          透過「白話輸出 $\rightarrow$ 查漏補缺 $\rightarrow$ 弱點重測」，最後自動產出個人專屬結構化筆記。
        </p>
      </div>

      {/* 流程步驟卡片展示 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl mt-0.5">
            <MessageSquareCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">1. 初學者提問</h4>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              AI 拆解 3~4 個核心盲點卡片，好奇向你請教。
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3.5">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl mt-0.5">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">2. 導師講解與追問</h4>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              自由白話說明或關鍵字擴展，學生針對盲點追問 1 次。
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl mt-0.5">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">3. 重測與統整筆記</h4>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              弱點卡片重測回想，最後匯出高品質 Markdown 筆記。
            </p>
          </div>
        </div>
      </div>

      {/* 輸入表單 */}
      <form onSubmit={handleSubmit} className="relative mb-8">
        <div className="relative flex items-center shadow-lg shadow-blue-500/5 rounded-2xl overflow-hidden border-2 border-blue-600/30 focus-within:border-blue-600 transition-colors bg-white">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="請輸入想複習的主題（例如：TCP 三向交握、JavaScript 閉包...）"
            disabled={isLoading}
            className="w-full pl-5 pr-32 py-4 text-base outline-none text-slate-800 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="absolute right-2 top-2 bottom-2 px-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>開始教學</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {!apiKey && (
          <p className="text-xs text-amber-600 mt-2 text-center font-medium">
            ⚠️ 提示：開始前請先點擊右上角設定 Gemini API Key。
          </p>
        )}
      </form>

      {/* 範例主題標籤 */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          不知道要複習什麼？試試這些精選主題：
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_TOPICS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100/80 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/60 hover:border-blue-200 transition-all text-left"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
