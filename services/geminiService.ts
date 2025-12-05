
import { GoogleGenAI } from "@google/genai";

// Initialize the client with the environment API Key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image using the specified model.
 * Automatically routes to `generateContent` (Gemini) or `generateImages` (Imagen) based on model ID.
 */
export const generateProductImage = async (
  base64Image: string | null, 
  prompt: string, 
  modelId: string = 'gemini-2.5-flash-image',
  aspectRatio: string = "1:1",
  resolution: string = "1K"
): Promise<string> => {
  try {
    
    // --- STRATEGY 1: IMAGEN MODELS (Text-to-Image) ---
    // Imagen models use the `generateImages` API and do not typically support image inputs in this context.
    if (modelId.startsWith('imagen')) {
        const response = await ai.models.generateImages({
            model: modelId,
            prompt: `Professional product photography. ${prompt}. High quality, photorealistic.`,
            config: {
                numberOfImages: 1,
                aspectRatio: aspectRatio as any,
                // outputMimeType: 'image/jpeg' 
            }
        });

        // Imagen returns `generatedImages` array
        if (response.generatedImages && response.generatedImages.length > 0) {
             const imageBytes = response.generatedImages[0].image.imageBytes;
             return `data:image/png;base64,${imageBytes}`;
        }
        throw new Error("No image generated from Imagen model.");
    }

    // --- STRATEGY 2: GEMINI / NANO BANANA MODELS (Image-to-Image) ---
    // These models use `generateContent` and support multimodal input (Image + Text).
    
    // 1. Prepare configuration
    const config: any = {
      imageConfig: {
        aspectRatio: aspectRatio,
      }
    };

    // Add resolution config only if using the Pro model (Nano Banana Pro)
    if (modelId === 'gemini-3-pro-image-preview') {
      config.imageConfig.imageSize = resolution; // "1K", "2K", "4K"
    }

    // 2. Prepare Contents (Text + Optional Image)
    const parts: any[] = [
        { text: `Professional product photography. ${prompt}. High quality, photorealistic.` }
    ];

    if (base64Image) {
        const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
        parts.unshift({
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', 
            },
        });
        // Update prompt to ensure model knows to use the image
        parts[1].text += " Keep the product exactly as is, but change the background and lighting to match the scene described.";
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: { parts },
      config: config
    });

    // Extract image from response (Gemini returns it in parts)
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated in response.");

  } catch (error: any) {
    console.error("Image Generation Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};

/**
 * Generates a short video ad using Veo.
 */
export const generateProductVideo = async (
  base64Image: string, 
  prompt: string, 
  modelId: string = 'veo-3.1-fast-generate-preview',
  aspectRatio: string = "9:16",
  resolution: string = "720p"
): Promise<string> => {
  try {
    // 1. Check for API Key Selection (Mandatory for Veo if in AI Studio environment)
    if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
           await window.aistudio.openSelectKey();
        }
    }

    // 2. Re-initialize AI client
    const veoAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    // 3. Start Video Generation Operation
    let operation = await veoAi.models.generateVideos({
      model: modelId,
      prompt: `Cinematic product commercial. ${prompt}. Dynamic camera movement, high quality lighting.`,
      image: {
        imageBytes: cleanBase64,
        mimeType: 'image/jpeg',
      },
      config: {
        numberOfVideos: 1,
        resolution: resolution as any, // 720p or 1080p
        aspectRatio: aspectRatio as any
      }
    });

    // 4. Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await veoAi.operations.getVideosOperation({operation: operation});
    }

    // 5. Get Result
    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      throw new Error("Video generation completed but no URI returned.");
    }
    
    // Append API key to fetch the actual content
    return `${videoUri}&key=${process.env.API_KEY}`;

  } catch (error: any) {
    console.error("Video Generation Error:", error);
    if (error.message?.includes("Requested entity was not found") && window.aistudio) {
        await window.aistudio.openSelectKey();
        throw new Error("Please re-select your API Key and try again.");
    }
    throw new Error(error.message || "Failed to generate video.");
  }
};
