import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudySession, StudyCard } from '../types';
import { 
  generateCards, 
  evaluateAnswerAndFollowUp, 
  getExpertExplanation, 
  synthesizeFinalNote 
} from '../services/gemini';

interface StudyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  session: StudySession | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  clearError: () => void;
  startSession: (topic: string) => Promise<void>;
  submitAnswer: (answer: string) => Promise<void>;
  requestExpertHelp: () => Promise<void>;
  submitRetestAnswer: (cardId: string, answer: string) => Promise<void>;
  completeSession: () => Promise<void>;
  resetSession: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const API_KEY_STORAGE_KEY = 'qstonote_gemini_api_key';
const SESSION_STORAGE_KEY = 'qstonote_current_session';

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>(() => {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
  });
  const [session, setSession] = useState<StudySession | null>(() => {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [session]);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
  };

  const clearError = () => setError(null);

  // 開始新學習 Session
  const startSession = async (topic: string) => {
    if (!apiKey) {
      setError('請先點擊右上角設定您的 Gemini API Key');
      return;
    }
    setIsLoading(true);
    setLoadingMessage('初學者學生正在針對該觀念構思疑問...');
    setError(null);

    try {
      const cards = await generateCards(topic, apiKey);
      if (cards.length === 0) {
        throw new Error('無法針對該主題產生問題卡片，請嘗試更具體的主題名稱');
      }

      // 將第一張卡片設為進行中
      cards[0].status = 'in_progress';

      const newSession: StudySession = {
        id: `session-${Date.now()}`,
        topic,
        cards,
        currentCardIndex: 0,
        phase: 'study',
        createdAt: Date.now()
      };

      setSession(newSession);
    } catch (err: any) {
      setError(err.message || '初始化學習階段失敗');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // 導師提交回答（初次或追問）
  const submitAnswer = async (answer: string) => {
    if (!session || !apiKey) return;

    const currentCard = session.cards[session.currentCardIndex];
    if (!currentCard) return;

    const isFollowUpRound = currentCard.status === 'follow_up';

    setIsLoading(true);
    setLoadingMessage(isFollowUpRound ? '學生正在消化您的補充說明...' : '初學者學生正在理解您的解釋...');
    setError(null);

    try {
      const updatedUserAnswers = [...currentCard.userAnswers, answer];
      const cardWithTempAnswers: StudyCard = {
        ...currentCard,
        userAnswers: updatedUserAnswers
      };

      const evalResult = await evaluateAnswerAndFollowUp(
        cardWithTempAnswers,
        answer,
        isFollowUpRound,
        apiKey
      );

      const updatedCards = [...session.cards];
      const isCardFinished = evalResult.isComplete || isFollowUpRound;

      updatedCards[session.currentCardIndex] = {
        ...currentCard,
        userAnswers: updatedUserAnswers,
        studentFeedback: {
          understood: evalResult.understood,
          missingOrConfused: evalResult.missingOrConfused,
          followUpQuestion: evalResult.followUpQuestion
        },
        status: isCardFinished ? 'completed' : 'follow_up'
      };

      let nextIndex = session.currentCardIndex;
      let nextPhase = session.phase;

      if (isCardFinished) {
        // 如果目前這張卡片已完成，推進到下一張或進入重測/總結
        if (session.currentCardIndex + 1 < session.cards.length) {
          nextIndex = session.currentCardIndex + 1;
          updatedCards[nextIndex].status = 'in_progress';
        } else {
          // 檢查是否有待重測卡片
          const hasRetest = updatedCards.some(c => c.status === 'needs_retest' && !c.isRetested);
          if (hasRetest) {
            nextPhase = 'retest';
          } else {
            // 直接產生筆記
            setSession({
              ...session,
              cards: updatedCards,
              phase: 'summary'
            });
            await triggerNoteGeneration({
              ...session,
              cards: updatedCards,
              phase: 'summary'
            });
            return;
          }
        }
      }

      setSession({
        ...session,
        cards: updatedCards,
        currentCardIndex: nextIndex,
        phase: nextPhase
      });
    } catch (err: any) {
      setError(err.message || '評估回答失敗');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // 反向求教（專家模式）
  const requestExpertHelp = async () => {
    if (!session || !apiKey) return;

    const currentCard = session.cards[session.currentCardIndex];
    if (!currentCard) return;

    setIsLoading(true);
    setLoadingMessage('正在切換為專家模式，為您整理清晰解法...');
    setError(null);

    try {
      const expertResult = await getExpertExplanation(
        session.topic,
        currentCard.question,
        apiKey
      );

      const updatedCards = [...session.cards];
      updatedCards[session.currentCardIndex] = {
        ...currentCard,
        expertSolution: expertResult,
        status: 'needs_retest' // 標記為需重測
      };

      setSession({
        ...session,
        cards: updatedCards
      });
    } catch (err: any) {
      setError(err.message || '獲取專家解答失敗');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // 提交重測回答
  const submitRetestAnswer = async (cardId: string, answer: string) => {
    if (!session) return;

    const updatedCards = session.cards.map(c => {
      if (c.id === cardId) {
        return {
          ...c,
          userAnswers: [...c.userAnswers, `[重測自我表述]: ${answer}`],
          isRetested: true
        };
      }
      return c;
    });

    const stillNeedsRetest = updatedCards.some(c => c.status === 'needs_retest' && !c.isRetested);

    if (!stillNeedsRetest) {
      const finalSessionState: StudySession = {
        ...session,
        cards: updatedCards,
        phase: 'summary'
      };
      setSession(finalSessionState);
      await triggerNoteGeneration(finalSessionState);
    } else {
      setSession({
        ...session,
        cards: updatedCards
      });
    }
  };

  const triggerNoteGeneration = async (currentSession: StudySession) => {
    if (!apiKey) return;
    setIsLoading(true);
    setLoadingMessage('正在根據整場教學互動，統整結構化精華筆記...');
    try {
      const note = await synthesizeFinalNote(currentSession, apiKey);
      setSession({
        ...currentSession,
        finalNote: note,
        phase: 'summary'
      });
    } catch (err: any) {
      setError(err.message || '生成筆記失敗');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const completeSession = async () => {
    if (!session) return;
    await triggerNoteGeneration(session);
  };

  const resetSession = () => {
    setSession(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  return (
    <StudyContext.Provider
      value={{
        apiKey,
        setApiKey,
        session,
        isLoading,
        loadingMessage,
        error,
        clearError,
        startSession,
        submitAnswer,
        requestExpertHelp,
        submitRetestAnswer,
        completeSession,
        resetSession
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy 必須在 StudyProvider 內部使用');
  }
  return context;
};
