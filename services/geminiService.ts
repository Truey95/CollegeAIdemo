
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

// Always initialize with named parameter and direct process.env.API_KEY
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Standard text generation with thinking budget for complex tasks.
 */
export const generateComplexText = async (prompt: string, thinking: boolean = false) => {
  const ai = getAI();
  const config: any = {};
  if (thinking) {
    // Max budget for gemini-3-pro-preview is 32768
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config
  });
  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

/**
 * Fast responses using Flash Lite.
 */
export const getFastResponse = async (prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    // Use 'gemini-flash-lite-latest' for flash lite tasks per guidelines
    model: 'gemini-flash-lite-latest',
    contents: prompt,
  });
  return response.text;
};

/**
 * Image generation using Gemini 3 Pro Image.
 */
export const generateImage = async (prompt: string, aspectRatio: AspectRatio, size: ImageSize) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio,
        imageSize: size
      }
    }
  });

  // Iterate through parts to find the image part
  for (const part of response.candidates?.[0].content.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data returned");
};

/**
 * Image editing using Gemini 2.5 Flash Image.
 */
export const editImage = async (base64Image: string, prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
        { text: prompt }
      ]
    }
  });

  // Find image part
  for (const part of response.candidates?.[0].content.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

/**
 * Video generation using Veo.
 */
export const generateVideo = async (prompt: string, aspectRatio: '16:9' | '9:16', imageBase64?: string) => {
  const ai = getAI();
  const payload: any = {
    model: 'veo-3.1-fast-generate-preview',
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio
    }
  };

  if (imageBase64) {
    payload.image = {
      imageBytes: imageBase64.split(',')[1],
      mimeType: 'image/png'
    };
  }

  let operation = await ai.models.generateVideos(payload);
  
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");
  
  // Append API key when fetching from the download link
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

/**
 * Search Grounding for current events.
 */
export const searchGrounding = async (query: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

/**
 * Maps Grounding.
 */
export const mapsGrounding = async (query: string, location?: { lat: number; lng: number }) => {
  const ai = getAI();
  const config: any = {
    tools: [{ googleMaps: {} }, { googleSearch: {} }]
  };
  
  if (location) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.lat,
          longitude: location.lng
        }
      }
    };
  }

  const response = await ai.models.generateContent({
    // Maps grounding is only supported in Gemini 2.5 series models
    model: 'gemini-2.5-flash',
    contents: query,
    config
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

/**
 * Audio Transcription.
 */
export const transcribeAudio = async (audioBase64: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: audioBase64, mimeType: 'audio/pcm;rate=16000' } },
        { text: "Transcribe this audio exactly." }
      ]
    }
  });
  return response.text;
};

/**
 * Text to Speech.
 */
export const textToSpeech = async (text: string, voice: string = 'Kore') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      // Must be an array with a single Modality.AUDIO element
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

/**
 * Video Understanding.
 */
export const analyzeVideo = async (videoUri: string, prompt: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
  });
  return response.text;
};
