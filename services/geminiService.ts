
// @google/genai SDK implementation for SafeWrite core AI services.
import { GoogleGenAI, Type } from "@google/genai";

// Initialize AI client with environment API key.
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");
  return new GoogleGenAI({ apiKey });
};

export const geminiService = {
  // 生成影像 (gemini-3-pro-image-preview)
  async generateImage(prompt: string, size: '1K' | '2K' | '4K' = '1K') {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from model");
  },

  // 使用 Imagen 4.0 生成高品質封面
  async generateImagenCover(prompt: string) {
    const ai = getAIClient();
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '3:4', 
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64Bytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64Bytes}`;
    }
    throw new Error("Imagen generation failed: No image returned");
  },

  // 出版導向審計功能
  async auditManuscript(content: string, type: 'tone' | 'pacing' | 'style') {
    const ai = getAIClient();
    const promptMap = {
      tone: "請針對以下文稿進行「語氣校對」。分析敘事者口吻是否一致，並指出語氣突兀的片段與改進建議。",
      pacing: "請針對以下文稿進行「節奏一致性檢查」。分析情節推進的快慢，是否有拖沓或跳躍過快的部分。",
      style: "請針對以下文稿進行「書籍體例檢查」。檢查標點符號規範、段落排版邏輯，確保符合專業出版美學。"
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `${promptMap[type]}\n\n${content}`,
    });
    return response.text || "審計結果暫不可用。";
  },

  // 封面視覺合規性 AI 檢測
  async checkCoverCompliance(base64Image: string, title: string) {
    const ai = getAIClient();
    const prompt = `作為專業印刷與出版專家，請分析這張封面圖（針對書名「${title}」）：
    1. 視覺中心是否避開了底部的「條碼預留區」（右下角 3x2cm 區域）？
    2. 文字與背景的對比度是否足以在實體書架辨識？
    3. 整體設計是否具有市場競爭力？
    請給出精簡的建議。`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] } },
        { text: prompt }
      ]
    });
    return response.text || "合規檢測完成。";
  },

  async analyzeManuscript(content: string) {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `請作為資深編輯，對以下文稿進行深度點評。分析其節奏、語言風格及結構：\n\n${content}`,
    });
    return response.text || "分析結果為空。";
  },

  async scanOutline(content: string) {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `請從以下文稿中提取視覺化大綱。以條列式呈現，區分層級：\n\n${content}`,
    });
    return response.text || "大綱提取為空。";
  },

  async translateText(content: string, targetLanguage: string) {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional translator. Translate the following text to ${targetLanguage}. Maintain the original tone, formatting, and nuances. Only return the translated text without any explanation:\n\n${content}`,
    });
    return response.text || content;
  },

  async summarizeText(content: string) {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `請簡要總結以下內容，保留核心要點：\n\n${content}`,
    });
    return response.text || content;
  },

  async rewriteText(content: string) {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `請潤色並改寫以下內容，使其語氣更生動且通順：\n\n${content}`,
    });
    return response.text || content;
  },

  // 測試連線功能 (Fix for components/AIPreferences.tsx)
  async testConnection(apiKey: string, provider: string) {
    if (provider !== 'GOOGLE') return true;
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: 'ping',
      });
      return !!response.text;
    } catch (e) {
      return false;
    }
  },

  // 提取專案結構 (Fix for components/StructureGraph.tsx)
  async analyzeProjectStructure(content: string) {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `請分析以下內容的敘事結構，並提取出核心的主題、人物及關鍵情節點。請以 JSON 格式回傳，包含一個 nodes 陣列，每個物件包含 id, label, type (其中 type 必須是 CHARACTER, NARRATIVE, RESEARCH 之一)。\n\n${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  type: { type: Type.STRING }
                },
                required: ['id', 'label', 'type']
              }
            }
          },
          required: ['nodes']
        }
      }
    });
    try {
      return JSON.parse(response.text || '{"nodes": []}');
    } catch (e) {
      return { nodes: [] };
    }
  },

  // 圖片文字擷取 (Fix for components/capture/ScanModule.tsx)
  async extractTextFromImage(base64Data: string) {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
        { text: "請辨識圖片中的所有文字，並將其拆分為邏輯段落。回傳 JSON 格式，包含 detectedLanguage (string), languageConfidence (number, 0-1), 以及 segments 陣列 (每個物件包含 text, type, confidence)。" }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedLanguage: { type: Type.STRING },
            languageConfidence: { type: Type.NUMBER },
            segments: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  type: { type: Type.STRING },
                  confidence: { type: Type.NUMBER }
                },
                required: ['text', 'type', 'confidence']
              }
            }
          },
          required: ['detectedLanguage', 'languageConfidence', 'segments']
        }
      }
    });
    try {
      return JSON.parse(response.text || '{}');
    } catch (e) {
      throw new Error("OCR 分析失敗");
    }
  },

  // 語音轉錄功能 (Fix for components/capture/VoiceModule.tsx)
  async transcribeAudio(base64Data: string, mimeType: string) {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        { inlineData: { mimeType, data: base64Data } },
        { text: "請將這段錄音內容精確地轉錄為文字。" }
      ]
    });
    return response.text || "";
  }
};
