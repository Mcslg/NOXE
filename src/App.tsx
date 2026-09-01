import React from 'react';
import { useStudy } from './context/StudyContext';
import { Header } from './components/Header';
import { TopicInput } from './components/TopicInput';
import { CardProgress } from './components/StudySession/CardProgress';
import { StudentCard } from './components/StudySession/StudentCard';
import { TutorInput } from './components/StudySession/TutorInput';
import { ExpertModal } from './components/StudySession/ExpertModal';
import { RetestSession } from './components/RetestSession';
import { NoteSummary } from './components/NoteSummary';
import { Loader2, AlertCircle, X } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { session, isLoading, loadingMessage, error, clearError } = useStudy();

  const currentCard = session ? session.cards[session.currentCardIndex] : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />

      {/* 錯誤警告條 */}
      {error && (
        <div className="max-w-3xl mx-auto px-4 mt-4 w-full animate-fadeIn">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="p-1 hover:bg-red-100 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 主要內容區 */}
      <main className="flex-1 flex flex-col justify-start">
        {!session && <TopicInput />}

        {session && session.phase === 'study' && currentCard && (
          <div className="max-w-3xl mx-auto px-4 py-8 w-full">
            <CardProgress />
            <StudentCard card={currentCard} />
            <TutorInput />
            <ExpertModal />
          </div>
        )}

        {session && session.phase === 'retest' && <RetestSession />}

        {session && session.phase === 'summary' && <NoteSummary />}
      </main>

      {/* 全域 Loading 浮層 */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white/95 rounded-2xl shadow-xl border border-slate-100 px-6 py-5 flex items-center gap-3.5 max-w-sm">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin shrink-0" />
            <p className="text-xs font-semibold text-slate-700 leading-snug">
              {loadingMessage || 'AI 正在運算中...'}
            </p>
          </div>
        </div>
      )}

      {/* 頁尾 */}
      <footer className="border-t border-slate-200/60 py-6 text-center text-xs text-slate-400">
        QsToNote — 費曼以教代學問答複習系統 • 本地安全儲存
      </footer>
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
