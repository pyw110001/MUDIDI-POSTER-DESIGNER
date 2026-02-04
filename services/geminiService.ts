import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please set the API_KEY environment variable.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeNewImage = async (base64Image: string, mimeType: string): Promise<string> => {
  const ai = getClient();
  const prompt = `
    Analyze this image specifically for an art direction prompt. 
    Identify:
    1. The visual style (e.g., flat, oil painting, pixel art).
    2. The main character design traits.
    3. The color palette usage.
    4. Key compositional elements.
    
    Format the output as a concise JSON object with keys: "style", "character", "colors", "composition", "suggestedPrompt".
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType, data: base64Image } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: 'application/json'
    }
  });

  return response.text || "{}";
};

export const generatePosterImage = async (prompt: string, aspectRatio: string = "3:4", referenceImage?: string): Promise<string> => {
  const ai = getClient();
  
  const parts: any[] = [];

  // If a reference image is provided, add it to the parts
  if (referenceImage) {
    // Extract mimeType and base64 data from the data URL
    // Format: data:image/png;base64,.....
    const matches = referenceImage.match(/^data:(.+);base64,(.+)$/);
    if (matches && matches.length === 3) {
        parts.push({
            inlineData: {
                mimeType: matches[1],
                data: matches[2]
            }
        });
    }
    
    // Append a strong instruction to the prompt to force character consistency
    prompt += " \n\nIMPORTANT: Use the character provided in the reference image. Maintain the exact appearance, facial features, and clothing style of the sheep in the reference image, but place it in the new scene described.";
  }

  // Add the text prompt
  parts.push({ text: prompt });

  // Using the high-quality image generation model (Nano Banana Pro)
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: parts
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio, // Supported: "1:1", "3:4", "4:3", "9:16", "16:9"
        imageSize: "1K" // Using 1K for standard generation
      }
    }
  });

  // Extract image from response
  const candidates = response.candidates;
  if (candidates && candidates.length > 0) {
     const contentParts = candidates[0].content.parts;
     for (const part of contentParts) {
       if (part.inlineData) {
         return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
       }
     }
  }

  throw new Error("No image generated. The model might have returned text instead.");
};