// services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, GeminiIdeaResponse, GroundingChunk } from "../types";
import { SYSTEM_INSTRUCTION, MODEL_CONFIG_PRO } from "../constants";

/**
 * Encodes a Uint8Array to a base64 string.
 * This is a utility function as per Gemini API guidance.
 * @param bytes The Uint8Array to encode.
 * @returns The base64 encoded string.
 */
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Ensure the API_KEY is available.
if (!process.env.API_KEY) {
  console.warn("API_KEY is not set. Gemini API calls may fail.");
}

/**
 * Converts a string budget range (e.g., "$10k-$50k") into a more descriptive format for the AI.
 * @param budgetRange The budget range string from user input.
 * @returns A descriptive string for the budget.
 */
const formatBudgetRangeForAI = (budgetRange: string): string => {
  switch (budgetRange) {
    case '$0-$10k': return 'very low budget (under $10,000)';
    case '$10k-$50k': return 'low to medium budget ($10,000 - $50,000)';
    case '$50k-$100k': return 'medium budget ($50,000 - $100,000)';
    case '$100k+': return 'high budget (over $100,000)';
    default: return 'unspecified budget';
  }
};

/**
 * Converts an array of skill strings into a comma-separated list for the AI.
 * @param skills The array of skill strings.
 * @returns A comma-separated string of skills, or 'no specific skills' if empty.
 */
const formatSkillsForAI = (skills: string[]): string => {
  if (!skills || skills.length === 0) {
    return 'no specific skills';
  }
  return skills.join(', ');
};

/**
 * Generates startup ideas using the Gemini API based on user input.
 * It uses both gemini-2.5-flash for search grounding and gemini-2.5-pro for complex reasoning.
 *
 * @param userInput The user's preferences for generating ideas.
 * @returns A promise that resolves to an array of validated startup ideas.
 */
export async function generateStartupIdeas(userInput: UserInput): Promise<GeminiIdeaResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const { industry, targetAudience, budgetRange, timeToMarket, skills } = userInput;

  const userPrompt = `Generate 3 innovative startup ideas considering the following:
  - Industry/Sector: ${industry || 'Any'}
  - Target Audience: ${targetAudience || 'General consumers/businesses'}
  - Budget Range: ${formatBudgetRangeForAI(budgetRange)}
  - Time to Market Preference: ${timeToMarket || 'Flexible'}
  - Available Skills: ${formatSkillsForAI(skills)}

  Please ensure the ideas are highly relevant to current market conditions, address specific pain points, and have clear paths to profitability and scalability.
  Provide detailed analysis as per the specified JSON schema.`;

  console.log("Sending prompt to Gemini:", userPrompt);

  try {
    // Merge the predefined model config with dynamic contents and system instruction
    const requestConfig = {
      ...MODEL_CONFIG_PRO,
      contents: { parts: [{ text: userPrompt }] },
      config: {
        ...MODEL_CONFIG_PRO.config,
        systemInstruction: SYSTEM_INSTRUCTION, // System instruction is now part of the config
      },
    };

    const response = await ai.models.generateContent(requestConfig);

    const rawText = response.text;
    console.log("Raw Gemini response text:", rawText);

    // Extract grounding chunks
    const groundingLinks: { uri: string; title: string; }[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      const chunks: GroundingChunk[] = response.candidates[0].groundingMetadata.groundingChunks as GroundingChunk[];
      for (const chunk of chunks) {
        if (chunk.web?.uri) {
          groundingLinks.push({ uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri });
        }
        if (chunk.maps?.uri) {
          groundingLinks.push({ uri: chunk.maps.uri, title: chunk.maps.title || chunk.maps.uri });
        }
        if (chunk.maps?.placeAnswerSources?.reviewSnippets) {
          for (const snippet of chunk.maps.placeAnswerSources.reviewSnippets) {
            if (snippet.uri) {
              groundingLinks.push({ uri: snippet.uri, title: snippet.title || snippet.uri });
            }
          }
        }
      }
    }

    // Attempt to parse the JSON response
    let parsedResponse: GeminiIdeaResponse;
    try {
      // Clean the rawText to ensure it's valid JSON.
      // Sometimes Gemini might wrap JSON in markdown code blocks or add pre/post text.
      const jsonMatch = rawText.match(/```json\n([\s\S]*?)\n```/);
      const cleanedJsonString = jsonMatch ? jsonMatch[1] : rawText;
      parsedResponse = { ideas: JSON.parse(cleanedJsonString) };
    } catch (jsonError) {
      console.error("Failed to parse Gemini response as JSON:", jsonError);
      console.error("Raw response that caused parsing error:", rawText);
      throw new Error("Failed to parse AI response. Please try again or refine your prompt.");
    }

    return { ...parsedResponse, groundingLinks };

  } catch (error) {
    console.error("Error generating startup ideas:", error);
    throw new Error(`Failed to generate ideas: ${(error as Error).message || "Unknown error."}`);
  }
}

/**
 * Generates a mini business plan outline for a selected startup idea.
 * This uses a simpler prompt and model, not requiring the full schema or thinking budget.
 *
 * @param ideaTitle The title of the startup idea.
 * @returns A promise that resolves to the business plan text.
 */
export async function generateMiniBusinessPlan(ideaTitle: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `Generate a concise business plan outline for the startup idea: "${ideaTitle}".
  Include sections like Executive Summary, Problem Statement, Solution, Target Market, Competition, Marketing Strategy, Operations Plan, Management Team, and Financial Projections Summary.
  Keep it to around 300-500 words.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using flash for quicker, simpler text generation
      contents: { parts: [{ text: prompt }] },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating mini business plan:", error);
    throw new Error(`Failed to generate business plan: ${(error as Error).message || "Unknown error."}`);
  }
}
