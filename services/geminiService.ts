
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiVehicleConfig } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function generateScenarioFromPrompt(prompt: string): Promise<GeminiVehicleConfig[]> {
  try {
    const systemInstruction = `You are a traffic simulation expert. Your task is to generate a vehicle setup for a V2V communication simulation based on a user's description.
The simulation area is a 3-lane highway.
- Lane 1 is the bottom lane.
- Lane 2 is the middle lane.
- Lane 3 is the top lane.
Each vehicle needs a unique ID (e.g., V1, V2), an initial X position (from 0 to 100), a lane (1, 2, or 3), an initial speed (a number from 1 to 10), and a color (e.g., 'blue', 'red', 'green', 'yellow', 'purple'). Generate between 3 and 7 vehicles.
You must return a valid JSON array of vehicle objects. Do not include any other text, markdown formatting, or explanations in your response.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: 'user', parts: [{ text: systemInstruction }, { text: `User request: "${prompt}"` }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Unique vehicle identifier, e.g., V1" },
              x: { type: Type.NUMBER, description: "Initial X position from 0 to 100" },
              lane: { type: Type.INTEGER, description: "Lane number: 1, 2, or 3" },
              speed: { type: Type.NUMBER, description: "Initial speed from 1 to 10" },
              color: { type: Type.STRING, description: "A common color name in lowercase" }
            },
            required: ['id', 'x', 'lane', 'speed', 'color']
          }
        },
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    if (!Array.isArray(parsedJson)) {
        throw new Error("Gemini API did not return a valid array.");
    }

    return parsedJson as GeminiVehicleConfig[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate scenario from Gemini API.");
  }
}
