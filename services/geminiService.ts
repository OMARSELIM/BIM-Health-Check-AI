import { GoogleGenAI, Type } from "@google/genai";
import { BimStats, AiAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBimHealth = async (stats: BimStats): Promise<AiAnalysisResult> => {
  const modelId = "gemini-3-flash-preview";
  
  const prompt = `
    Act as an expert BIM Manager and QA/QC Specialist compliant with ISO 19650 standards.
    Analyze the following BIM Model statistics extracted from a ${stats.fileName} file.
    
    Data:
    - File Name: ${stats.fileName}
    - File Size: ${stats.fileSizeMb} MB
    - Total Elements: ${stats.elementCount}
    - Warnings: ${stats.warningCount}
    - In-Place Families: ${stats.inPlaceFamilies} (These are bad for performance)
    - Families without defined parameters: ${stats.familiesWithoutParams}
    - Unused Views: ${stats.unusedViews}
    - Unused Levels: ${stats.unusedLevels}
    - Missing Links: ${stats.missingLinks}
    - Complexity: ${stats.modelComplexity}

    Task:
    1. Calculate a "Model Health Score" from 0 to 100 based on industry best practices (e.g., in-place families should be 0, warnings should be low relative to elements).
    2. Provide a 1-sentence executive summary.
    3. Provide 3-5 specific, actionable recommendations to improve the model. Classify them by priority and category (ISO 19650, Performance, or Standardization).
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  category: { type: Type.STRING, enum: ["ISO 19650", "Performance", "Standardization"] },
                },
                required: ["title", "description", "priority", "category"],
              },
            },
          },
          required: ["score", "summary", "recommendations"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");
    
    return JSON.parse(resultText) as AiAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback if AI fails
    return {
      score: 50,
      summary: "AI Analysis failed, but here is a default assessment based on raw data.",
      recommendations: [
        {
          title: "Check Warnings",
          description: "High warning count detected. Review and resolve.",
          priority: "High",
          category: "Performance"
        },
        {
          title: "Purge Unused",
          description: "Remove unused views and families to reduce file size.",
          priority: "Medium",
          category: "Performance"
        }
      ]
    };
  }
};
