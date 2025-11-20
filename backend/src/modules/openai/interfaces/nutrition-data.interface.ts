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
  vitamins?: Record<string, string>;
  minerals?: Record<string, string>;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ImageAnalysisResult {
  isNutritionLabel: boolean;
  ocrText: string;
  nutritionData: NutritionData | null;
  foodRecognition: string;
}
