import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables");
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateWittyMessage = async (): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Write a short, witty, philosophical, or cryptic pager message. It should be under 25 words. Do not include quotes.",
      config: {
        temperature: 1.2,
      }
    });

    return response.text || "Error generating message.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection lost. Signal weak.";
  }
};
