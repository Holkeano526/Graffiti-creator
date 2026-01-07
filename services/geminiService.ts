
import { GoogleGenAI } from "@google/genai";

const GRAFFITI_PROMPT = `Create a photorealistic render of the uploaded letterform as if spray-painted on a weathered red brick wall. The structure must exactly match the uploaded image. The graffiti should have slightly oversprayed edges, visible drip marks, and worn paint layers. The brick wall should be detailed with mortar lines, cracks, dirt, and faded posters or tags around it. Add ambient shadows and subtle wall lighting from a nearby urban lamp or natural window. Background should feel gritty and authentic, like an alley or industrial zone. — Follow uploaded shape exactly — graffiti must appear realistically integrated — no stylization or exaggeration.`;

export async function generateGraffiti(base64Image: string, mimeType: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: GRAFFITI_PROMPT,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
        }
      }
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("Failed to generate content: No parts returned.");
    }

    const imagePart = response.candidates[0].content.parts.find(p => p.inlineData);
    
    if (imagePart?.inlineData?.data) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }

    throw new Error("No image data found in the response.");
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "An error occurred during graffiti generation.");
  }
}
