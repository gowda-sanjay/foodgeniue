import { ApiError } from '../utils/apiError';

const geminiKey = process.env.GEMINI_API_KEY;

if (!geminiKey) {
  throw new ApiError(500, 'Gemini API key is not configured');
}

export async function chatAi(userId: string, data: any) {
  return { message: `AI chat response for "${data.message}"` };
}

export async function searchAi(userId: string, data: any) {
  return { results: [`Search result for ${data.query}`] };
}

export async function imageAi(userId: string, data: any) {
  return { analysis: `Image analysis for ${data.imageUrl}` };
}

export async function voiceAi(userId: string, data: any) {
  return { transcription: `Transcribed text from ${data.audioUrl}` };
}

export async function recommendAi(userId: string, data: any) {
  return { recommendations: [`Recommended food for ${data.preferences || 'default'}`] };
}
