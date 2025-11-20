export interface NutritionData {
  servingSize?: string;
  servingsPerContainer?: number;
  calories?: number;
  totalFat?: string;
  saturatedFat?: string;
  transFat?: string;
  cholesterol?: string;
  sodium?: string;
  totalCarbohydrates?: string;
  dietaryFiber?: string;
  totalSugars?: string;
  addedSugars?: string;
  protein?: string;
  vitaminD?: string;
  calcium?: string;
  iron?: string;
  potassium?: string;
}

export interface ImageAnalysisResult {
  isNutritionLabel: boolean;
  ocrText: string;
  nutritionData: NutritionData | null;
  foodRecognition: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  nutritionData: NutritionData | null;
  imageAnalysis: ImageAnalysisResult | null;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface AnalyzeImageResponse {
  success: boolean;
  data: ImageAnalysisResult;
}

export interface ChatResponse {
  success: boolean;
  response: string;
}
