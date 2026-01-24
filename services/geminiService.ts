
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");
  return new GoogleGenAI({ apiKey });
};

export const geminiService = {
  // OCR 文字提取：使用 Flash 模型處理圖片
  async extractTextFromImage(base64Data: string) {
    const ai = getAIClient();
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data,
      },
    };
    const prompt = "請提取圖片中的所有文字。將文字劃分為邏輯段落（Segments），並以 JSON 陣列格式回傳：[{'text': '內容', 'confidence': 0.98}]。僅回傳 JSON。";
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, { text: prompt }] },
      config: { responseMimeType: "application/json" }
    });
    
    try {
      return JSON.parse(response.text);
    } catch (e) {
      return [{ text: response.text, confidence: 0.9 }];
    }
  },

  // 結構圖譜分析：使用 Pro 模型 + 思考預算
  async analyzeProjectStructure(content: string) {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `身為敘事架構專家，請分析以下文稿並提取關鍵結構節點（角色、敘事、研究）。\n\n${content}`,
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
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
                  type: { type: Type.STRING, description: "NARRATIVE, CHARACTER, or RESEARCH" },
                  description: { type: Type.STRING }
                },
                required: ["id", "label", "type"]
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  },

  async analyzeManuscript(content: string) {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `身為資深編輯，請針對以下文本進行結構與語氣分析，並給予具體建議：\n\n${content}`,
      config: { thinkingConfig: { thinkingBudget: 24000 } }
    });
    return response.text;
  },

  // 提取大綱：分析文稿並生成結構化大綱
  async scanOutline(content: string) {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `請詳細分析以下文稿內容並生成一份層級結構分明的大綱：\n\n${content}`,
      config: {
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });
    return response.text;
  },

  // 角色分析：分析文稿中的角色發展與動機
  async analyzeCharacters(content: string) {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `身為文學評論家，請分析以下文稿中的主要角色、性格特徵、角色間的關係以及核心動機：\n\n${content}`,
      config: {
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });
    return response.text;
  }
};
