
import { GoogleGenAI, Type } from "@google/genai";

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
        aspectRatio: '3:4', // Standard book cover aspect ratio
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64Bytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64Bytes}`;
    }
    throw new Error("Imagen generation failed: No image returned");
  },

  // 生成影片 (veo-3.1-fast-generate-preview)
  async generateVideo(prompt: string, aspectRatio: '16:9' | '9:16', base64Image?: string) {
    const ai = getAIClient();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      ...(base64Image ? {
        image: {
          imageBytes: base64Image,
          mimeType: 'image/png'
        }
      } : {}),
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed: No download link");
    
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
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

  async analyzeCharacters(content: string) {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `請分析以下文稿中的主要角色心理建模。描述其性格特徵、動機及成長弧線：\n\n${content}`,
    });
    return response.text || "角色分析為空。";
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

  async transcribeAudio(base64Data: string, mimeType: string) {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        },
        { text: "請準確地將這段音檔轉換為繁體中文文字。僅回傳轉換後的文字內容，不需要任何解釋或引號。" }
      ]
    });
    return response.text || "";
  },

  async analyzeProjectStructure(content: string) {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `請分析以下文稿的敘事結構、角色關係及研究重點。並以 JSON格式回傳 nodes 陣列，每個 node 包含 id, label, type (CHARACTER, NARRATIVE, RESEARCH)：\n\n${content}`,
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
                  type: { type: Type.STRING, description: 'CHARACTER, NARRATIVE, or RESEARCH' }
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
      console.error("Failed to parse JSON for project structure:", e);
      return { nodes: [] };
    }
  },

  async extractTextFromImage(base64Data: string) {
    const ai = getAIClient();
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data,
      },
    };
    const prompt = `你是一個世界級的 OCR 與文檔視覺結構分析專家。請執行深度文本提取任務：
1. **精確提取**：捕捉所有文字，包含極小字體與特殊符號。
2. **自動語言偵測**：識別文本主語言（如：繁體中文、English 等），並提供 0.0 至 1.0 的信心分數。
3. **邏輯層級分析**：識別文檔的視覺邏輯，區分標題、次標題、正文與引用區塊。
4. **Markdown 保存**：在正文片段中保留基本的 Markdown 語法（如 - 列表、** 粗體）。
5. **語義分類**：將文字劃分為「title (大標)」、「heading (小標)」、「body (正文)」、「quote (引用)」或「metadata (腳註)」。
請嚴格以 JSON 格式回傳結果。`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [imagePart, { text: prompt }] },
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
                  type: { type: Type.STRING, description: "One of: title, heading, body, quote, metadata" },
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
      return JSON.parse(response.text || '{"detectedLanguage": "Unknown", "languageConfidence": 0, "segments": []}');
    } catch (e) {
      return { 
        detectedLanguage: "偵測失敗", 
        languageConfidence: 0, 
        segments: [{ text: response.text || "解析異常", type: "body", confidence: 0.5 }] 
      };
    }
  },

  async testConnection(apiKey: string, provider: string) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Hello, connection test. Respond with 'OK'.",
      });
      return response.text?.includes('OK');
    } catch (e) {
      return false;
    }
  }
};
