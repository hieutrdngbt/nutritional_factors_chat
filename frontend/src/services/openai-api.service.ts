import {
  AnalyzeImageResponse,
  ChatResponse,
  NutritionData,
  ChatMessage,
} from '../types/nutrition.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class OpenAIApiService {
  /**
   * Analyze nutrition image using OpenAI Vision API
   */
  async analyzeImage(file: File): Promise<AnalyzeImageResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/openai/analyze-image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze image');
    }

    return response.json();
  }

  /**
   * Chat with nutrition context
   */
  async chat(
    message: string,
    nutritionContext?: NutritionData,
    conversationHistory?: ChatMessage[],
  ): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/openai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        nutritionContext,
        conversationHistory,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get chat response');
    }

    return response.json();
  }
}

export const openAIApiService = new OpenAIApiService();
