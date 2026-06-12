
import { GoogleGenAI, Type } from "@google/genai";
import { ExpertiseClassification } from '../types';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function classifyExpertise(text: string): Promise<ExpertiseClassification> {
  if (!text.trim()) {
    throw new Error("Input text cannot be empty.");
  }

  const prompt = `You are an expert brand strategist and career coach. Analyze the following text describing a person's skills, experience, and bio. Based on the text, classify their primary areas of expertise into 3-5 concise keywords or phrases. Also, provide a one-sentence summary of their professional brand.

Text to analyze:
---
${text}
---
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            expertiseAreas: {
              type: Type.ARRAY,
              description: "A list of 3-5 concise keywords or phrases classifying the person's primary areas of expertise.",
              items: {
                type: Type.STRING,
              },
            },
            summary: {
              type: Type.STRING,
              description: "A compelling one-sentence summary of the person's professional brand."
            },
          },
          required: ["expertiseAreas", "summary"],
        },
        temperature: 0.3,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    return parsedData as ExpertiseClassification;

  } catch (error) {
    console.error("Error classifying expertise:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get classification from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
}
