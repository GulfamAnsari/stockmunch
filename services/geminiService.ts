
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const analyzeNewsImpact = async (title: string, content: string) => {
  if (!API_KEY) return "AI Analysis requires an API key.";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following stock market news and provide a brief (2 sentence) professional summary of the potential market impact for short-term traders: 
      Title: ${title}
      Content: ${content}`,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    return response.text || "Unable to generate analysis at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating AI analysis.";
  }
};
