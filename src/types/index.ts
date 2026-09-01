export interface StudyCard {
  id: string;
  topic: string;
  question: string;         // 初學者學生的提問
  contextHint?: string;     // 該問題考查的核心觀念提示
  userAnswers: string[];    // 導師的回答歷史（初次回答、追問回答）
  studentFeedback?: {
    understood: string;     // 學生聽懂的點
    missingOrConfused: string; // 學生困惑或未被解釋的點
    followUpQuestion?: string; // 學生的追問（第 1 輪追問）
  };
  expertSolution?: {
    summary: string;
    keyPoints: string[];
    analogy: string;
  };
  status: 'pending' | 'in_progress' | 'follow_up' | 'completed' | 'needs_retest';
  isRetested?: boolean;
}

export interface StudySession {
  id: string;
  topic: string;
  cards: StudyCard[];
  currentCardIndex: number;
  phase: 'study' | 'retest' | 'summary';
  createdAt: number;
  finalNote?: string;
}

export interface ApiSettings {
  geminiApiKey: string;
  model: string;
}
