import { StudyCard, StudySession } from '../types';

// 經由 ListModels 驗證的可用模型清單，預設使用最穩定優質的 gemini-2.5-flash
export const SUPPORTED_MODELS = [
  'gemini-2.5-flash',
  'gemini-3.7-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro',
  'gemini-3.5-flash'
];

export const DEFAULT_MODEL = 'gemini-2.5-flash';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
    code?: number;
  };
}

async function callSingleModel(
  apiKey: string,
  prompt: string,
  modelName: string,
  isJson: boolean = false
): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;

  const body: any = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
    }
  };

  if (isJson) {
    body.generationConfig.responseMimeType = "application/json";
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData: GeminiResponse = await response.json().catch(() => ({}));
    const errMsg = errorData.error?.message || `HTTP ${response.status}`;
    throw new Error(`[${modelName}] ${errMsg}`);
  }

  const data: GeminiResponse = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error(`[${modelName}] 未回傳有效內容`);
  }

  return text;
}

// 支援自動模型 Fallback 的通用呼叫函數
export async function callGemini(
  apiKey: string,
  prompt: string,
  isJson: boolean = false
): Promise<string> {
  if (!apiKey) {
    throw new Error('請先在設定中輸入 Gemini API Key');
  }

  let lastError: Error | null = null;

  for (const model of SUPPORTED_MODELS) {
    try {
      return await callSingleModel(apiKey, prompt, model, isJson);
    } catch (err: any) {
      console.warn(`調用模型 ${model} 失敗，嘗試備用模型:`, err.message);
      lastError = err;
    }
  }

  throw new Error(`Gemini API 呼叫失敗: ${lastError?.message || '模型存取失敗'}`);
}

// 1. 輸入觀念，拆解為 3-4 張初學者提問卡片
export async function generateCards(
  topic: string,
  apiKey: string
): Promise<StudyCard[]> {
  const prompt = `你是一個教學設計專家與初學者。使用者想要複習/學習的主題是：「${topic}」。
請將這個主題拆解為 3 到 4 個核心觀念問題。
重點要求：
1. 問題必須以「對該領域好奇、剛入門的初學者」的語氣提出（例如：「老師，為什麼...？」、「這跟...有什麼差別？」）。
2. 由淺入深，逐步引導核心邏輯與常見容易混淆的盲點。
3. 輸出必須為嚴格的 JSON 陣列格式，不可包含 Markdown 標記，格式如下：
[
  {
    "question": "初學者提出的問題",
    "contextHint": "這個問題考查的核心觀念重點"
  }
]`;

  const rawJson = await callGemini(apiKey, prompt, true);
  try {
    const cleaned = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed.map((item: any, index: number) => ({
      id: `card-${Date.now()}-${index}`,
      topic,
      question: item.question,
      contextHint: item.contextHint,
      userAnswers: [],
      status: 'pending'
    }));
  } catch (err) {
    console.error('Failed to parse cards JSON:', rawJson, err);
    throw new Error('解析卡片資料失敗，請稍後重試');
  }
}

// 2. 初學者學生評估導師回答並提出追問
export async function evaluateAnswerAndFollowUp(
  card: StudyCard,
  currentAnswer: string,
  isFollowUpRound: boolean,
  apiKey: string
): Promise<{ understood: string; missingOrConfused: string; followUpQuestion?: string; isComplete: boolean }> {
  const historyText = card.userAnswers.map((ans, idx) => `[導師前次回應 ${idx + 1}]: ${ans}`).join('\n');

  const prompt = `你現在扮演一個「對 ${card.topic} 領域完全是初學者的學生」。
你剛才向老師（使用者）請教了問題：「${card.question}」
這個問題的核心觀念是：「${card.contextHint || ''}」

${historyText ? `先前的問答紀錄：\n${historyText}\n` : ''}
老師剛剛給予的最新解答：
「${currentAnswer}」

這是${isFollowUpRound ? '第二輪（最終輪）回答' : '第一輪回答'}。

請以初學者學生的口氣評估：
1. understood: 一句話白話總結你從老師的解釋中聽懂了什麼重點。
2. missingOrConfused: 指出老師哪裡講得太抽象、用了專有名詞沒解釋，或者哪個核心邏輯遺漏了（若老師講得非常完美，請填空字串 ""）。
3. ${isFollowUpRound 
      ? '因為已經是第二輪，不需再追問，請將 followUpQuestion 設為 null，並將 isComplete 設為 true。' 
      : '如果老師的回答已經很完整沒有盲點，將 isComplete 設為 true，followUpQuestion 設為 null；如果有盲點或關鍵細節沒說清，提出 1 個具啟發性的初學者追問（例如：「老師，那如果遇到...時該怎麼辦？」），並將 isComplete 設為 false。'}

請嚴格輸出 JSON 格式：
{
  "understood": "我聽懂了...",
  "missingOrConfused": "但我還是有點好奇/不太懂...",
  "followUpQuestion": "老師，那...",
  "isComplete": true/false
}`;

  const rawJson = await callGemini(apiKey, prompt, true);
  const cleaned = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

// 3. 關鍵字擴展為導師草稿
export async function expandKeywordsToDraft(
  keywords: string,
  question: string,
  apiKey: string
): Promise<string> {
  const prompt = `你是一個教學輔助助手。使用者是一位導師，正要回答初學者學生的問題：「${question}」。
使用者只提供了幾個關鍵字/碎片想法：「${keywords}」。
請幫導師將這些關鍵字擴展成一段口語化、親切、深入淺出的教學回答草稿（繁體中文），讓導師可以快速修改或確認後直接送出。請直接輸出回答內容，不要包含多餘的問候或備註。`;

  return await callGemini(apiKey, prompt, false);
}

// 4. 專家模式解答（反向求教）
export async function getExpertExplanation(
  topic: string,
  question: string,
  apiKey: string
): Promise<{ summary: string; keyPoints: string[]; analogy: string }> {
  const prompt = `你是一位頂尖的資深領域專家與卓越教育家。
使用者在學習「${topic}」時，遇到了以下問題感到困惑，向你求助：
問題：「${question}」

請提供一份清晰易懂、條理分明的專家教學：
1. summary: 一段精闢的核心總結（約 2-3 句話）。
2. keyPoints: 3 到 4 個核心要點條列（陣列）。
3. analogy: 一個生動貼切的日常生活比喻（幫助直覺理解）。

請嚴格輸出 JSON 格式：
{
  "summary": "...",
  "keyPoints": ["要點 1", "要點 2", "要點 3"],
  "analogy": "..."
}`;

  const rawJson = await callGemini(apiKey, prompt, true);
  const cleaned = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

// 5. 彙整完整學習筆記
export async function synthesizeFinalNote(
  session: StudySession,
  apiKey: string
): Promise<string> {
  const cardDetails = session.cards.map((c, i) => {
    return `### 卡片 ${i + 1}: ${c.question}
- 核心概念: ${c.contextHint || '無'}
- 導師回答: ${c.userAnswers.join(' | ') || '（求助專家模式）'}
- 學生反饋: ${c.studentFeedback ? `聽懂: ${c.studentFeedback.understood}; 困惑/追問: ${c.studentFeedback.missingOrConfused}` : '無'}
- 曾求助專家: ${c.status === 'needs_retest' || c.expertSolution ? '是' : '否'}`;
  }).join('\n\n');

  const prompt = `你是一位專業的知識管理與學習筆記專家。
使用者剛透過「以教代學（費曼學習法）」完成了一次主題為「${session.topic}」的深度複習。
以下是本次學習的所有問答與互動紀錄：

${cardDetails}

請根據上述互動紀錄，為使用者整理出一份高質量、結構化、可長期複習的 Markdown 筆記（繁體中文）。
筆記必須包含以下區塊：
1. # 【主題筆記】[主題名稱]
2. ## 核心心智模型與架構（用最精簡的幾句話或架構總結這個主題）
3. ## 觀念深度剖析（將問答轉化為條理分明的知識點，包含重點、原理與常見盲點/易錯處）
4. ## 費曼教學盲點對照（特別點出導師在初期解釋時遺漏或曾求助專家的細節，加強記憶提醒）
5. ## 一句話精華總結

請直接輸出 Markdown 文字。`;

  return await callGemini(apiKey, prompt, false);
}
