import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  NutritionData,
  ChatMessage,
  ImageAnalysisResult,
} from './interfaces/nutrition-data.interface';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({ apiKey });
  }

  async analyzeNutritionImage(imageBase64: string): Promise<ImageAnalysisResult> {
    this.logger.log('Analyzing nutrition image with GPT-4 Vision');

    const prompt = `
Analyze this image carefully.

If this is a nutrition facts label:
1. Extract ALL visible text from the label (OCR)
2. Identify and extract nutrition information in this JSON format:
{
  "servingSize": "amount with unit",
  "servingsPerContainer": number,
  "calories": number,
  "totalFat": "amount with unit",
  "saturatedFat": "amount with unit",
  "transFat": "amount with unit",
  "cholesterol": "amount with unit",
  "sodium": "amount with unit",
  "totalCarbohydrates": "amount with unit",
  "dietaryFiber": "amount with unit",
  "totalSugars": "amount with unit",
  "addedSugars": "amount with unit",
  "protein": "amount with unit",
  "vitaminD": "amount with unit",
  "calcium": "amount with unit",
  "iron": "amount with unit",
  "potassium": "amount with unit"
}

If this is a food dish without a nutrition label:
1. Identify the food/dish by name
2. Provide estimated nutritional information based on typical values for this food
3. Note that these are estimates

Return ONLY a JSON response (no markdown, no code blocks) with this exact structure:
{
  "isNutritionLabel": true or false,
  "ocrText": "all extracted text if nutrition label, empty string otherwise",
  "nutritionData": {nutrition object or null},
  "foodRecognition": "description of the food/dish"
}
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL_VISION', 'gpt-4o-mini'),
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
        temperature: 0.2,
      });

      const content = response.choices[0].message.content;
      this.logger.log('Received response from OpenAI Vision API');

      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      // Parse JSON response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON from OpenAI response');
      }

      const result: ImageAnalysisResult = JSON.parse(jsonMatch[0]);

      return result;
    } catch (error) {
      this.logger.error('Error analyzing image with OpenAI', error.stack);
      throw error;
    }
  }

  async chatWithNutritionContext(
    message: string,
    nutritionContext?: NutritionData,
    conversationHistory?: ChatMessage[],
  ): Promise<string> {
    this.logger.log('Processing chat message with nutrition context');

    const systemPrompt = `You are a nutrition expert assistant helping users understand nutrition facts labels according to FDA standards (https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label).

${
  nutritionContext
    ? `Current Nutrition Data Available:\n${JSON.stringify(nutritionContext, null, 2)}\n`
    : ''
}

Your responsibilities:
- Provide accurate, helpful answers about nutritional content
- Explain nutrition facts in simple terms
- Reference the FDA Nutrition Facts Label guidelines
- Explain % Daily Values (based on 2,000 calorie diet)
- Offer healthy eating advice when appropriate
- Be concise but informative

When nutrition data is available, always reference it in your answers.`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    try {
      const response = await this.openai.chat.completions.create({
        model: this.configService.get<string>('OPENAI_MODEL_CHAT', 'gpt-4-turbo-preview'),
        messages,
        max_tokens: 800,
        temperature: 0.7,
      });

      const reply = response.choices[0].message.content;
      this.logger.log('Received chat response from OpenAI');

      if (!reply) {
        throw new Error('No reply in OpenAI response');
      }

      return reply;
    } catch (error) {
      this.logger.error('Error getting chat response from OpenAI', error.stack);
      throw error;
    }
  }
}
