import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, RiskLevel, Sector, Stock, StockDetails } from "../types";

const apiKey = process.env.API_KEY;

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: apiKey });

export const getStockRecommendations = async (
  sector: Sector,
  risk: RiskLevel
): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const sectorPrompt = sector === Sector.ALL ? "diverse sectors" : theSector(sector);
  
  const prompt = `
    Find 10 currently trending stocks in the Indian Stock Market (NSE/BSE) suitable for a ${risk} risk short-term investment strategy (1-3 months horizon).
    Focus on the ${sectorPrompt} sector in India.
    
    Use Google Search to find the most recent price data (in INR), percentage change from the last session, and key catalysts.
    
    CRITICAL OUTPUT INSTRUCTIONS:
    You must output the result strictly as a valid JSON array inside a markdown code block like \`\`\`json ... \`\`\`.
    Do not add any conversational text outside the code block.
    
    The JSON array must contain objects with this exact schema:
    {
      "symbol": "Ticker Symbol (e.g., RELIANCE or TCS)",
      "name": "Company Name",
      "price": "Current Price in INR (e.g., ₹2,450.00)",
      "change": "Change string (e.g., +1.2% or -0.5%)",
      "changePercent": number (e.g., 1.2 or -0.5),
      "reason": "A concise (15-20 words) explanation of why this is a good short-term pick based on recent Indian market news.",
      "sector": "Sector Name",
      "riskLevel": "Low" | "Medium" | "High"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json" // NOT ALLOWED with googleSearch
      },
    });

    const text = response.text || "";
    
    // Extract JSON from code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    let parsedStocks: Stock[] = [];
    
    if (jsonMatch && jsonMatch[1]) {
      parsedStocks = JSON.parse(jsonMatch[1]);
    } else {
      // Fallback: try to parse the raw text if the model forgot the code block but sent JSON
      try {
        parsedStocks = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON directly", e);
        throw new Error("Could not parse stock data from AI response.");
      }
    }

    // Extract Grounding Metadata
    const sources: any[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    return {
      stocks: parsedStocks,
      sources: sources
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const getStockDetails = async (symbol: string): Promise<StockDetails> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const prompt = `
    Perform a comprehensive short-term investment analysis (1-3 months) for ${symbol} in the Indian Stock Market.
    Use Google Search to find the latest technical indicators, news, and earnings reports.
    
    CRITICAL OUTPUT INSTRUCTIONS:
    Output strictly valid JSON inside a code block. The JSON must follow this schema:
    {
      "technicalAnalysis": "Detailed paragraph (approx 50-70 words) covering Moving Averages, RSI, MACD, and chart patterns.",
      "fundamentalAnalysis": "Detailed paragraph (approx 50-70 words) covering recent earnings, news catalysts, and sector performance.",
      "targetPrice": "Specific price target in INR (e.g., ₹2,800)",
      "stopLoss": "Specific stop loss price in INR (e.g., ₹2,350)",
      "upsidePotential": "Percentage string (e.g., +12.5%)",
      "confidenceScore": number (0-100, representing the probability of reaching the target based on current indicators),
      "supportLevels": ["Level 1", "Level 2"],
      "resistanceLevels": ["Level 1", "Level 2"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    } else {
      try {
        return JSON.parse(text);
      } catch (e) {
         // Create a fallback object if parsing fails to avoid crashing the modal
         return {
             technicalAnalysis: "Analysis currently unavailable.",
             fundamentalAnalysis: "Analysis currently unavailable.",
             targetPrice: "N/A",
             stopLoss: "N/A",
             upsidePotential: "N/A",
             confidenceScore: 0,
             supportLevels: [],
             resistanceLevels: []
         };
      }
    }
  } catch (error) {
    console.error("Gemini Detail API Error:", error);
    throw error;
  }
};


function theSector(s: Sector): string {
    return s;
}
