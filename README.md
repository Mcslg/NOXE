# QsToNote 🎓

> **以教代學（費曼學習法）驅動的問答式複習 Web 工具**  
> 你來扮演導師，教懂對面的 AI 初學者學生。從主動輸出、查漏追問到弱點重測，自動彙整個人專屬結構化筆記。

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 💡 設計理念 (Protégé Effect & Feynman Technique)

傳統的 AI 學習工具多為「AI 講、人聽」，容易產生「以為自己懂了」的被動假象。**QsToNote** 反轉了這個關係：

1. **使用者扮演導師**：強迫用最白話的語言向初學者學生解釋概念。
2. **AI 扮演初學者學生**：提出直覺問題，並在聽完解釋後指出「聽懂的點」與「邏輯盲點」，發起關鍵追問。
3. **專家模式反向求教**：遇到卡關時切換為專家模式學習解析，並自動打上「待重測」標籤。
4. **尾聲弱點重測**：Session 結束前重新抽查曾卡關的觀念，強化長期記憶。
5. **結構化筆記導出**：將教學盲點與對話精華統整為 Markdown 筆記。

---

## ✨ 核心特色

- 🔒 **本地隱私安全**：純前端單頁應用（SPA），Gemini API Key 僅儲存在瀏覽器 `localStorage`，不經過第三方伺服器。
- ⚡ **直達答題流程**：輸入主題立即拆解 3~4 個核心問題卡片並直接開始作答。
- ✍️ **多元導師作答模式**：
  - **自由教學**：直接以白話輸入講解（支援 `Ctrl/Cmd + Enter` 快捷送出）。
  - **關鍵字輔助**：輸入零散筆記關鍵字，AI 自動擴展為教學草稿。
  - **專家求教**：一鍵獲取清晰核心要點與生活化比喻。
- 🔄 **單次學習閉環**：包含學生盲點追問、結尾弱點二次回想。
- 📄 **一鍵導出**：支援 Markdown 筆記即時預覽、一鍵複製與 `.md` 檔案下載。

---

## 🛠️ 技術棧

- **框架**：React 18 + TypeScript
- **建置工具**：Vite
- **樣式**：Tailwind CSS + Lucide Icons
- **AI 驅動**：Google Gemini API (`gemini-1.5-flash`)

---

## 🚀 快速開始

### 1. 複製專案與安裝依賴

```bash
git clone https://github.com/your-username/QsToNote.git
cd QsToNote
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

啟動後於瀏覽器開啟 `http://localhost:5173`。

### 3. 設定 API Key

點擊頁面右上角的「**設定 API Key**」，填入您的 [Google AI Studio Gemini API Key](https://aistudio.google.com/app/apikey) 即可開始使用。

---

## 📦 建置與部署

```bash
npm run build
```

打包完成後輸出於 `dist/` 目錄，可直接部署於 Vercel、Netlify 或 GitHub Pages。

---

## 📄 授權條款

本專案採用 [MIT License](LICENSE) 授權。
