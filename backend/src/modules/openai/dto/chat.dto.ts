import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NutritionData, ChatMessage } from '../interfaces/nutrition-data.interface';

export class ChatDto {
  @ApiProperty({ description: 'User message' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ description: 'Nutrition context data' })
  @IsOptional()
  nutritionContext?: NutritionData;

  @ApiPropertyOptional({ description: 'Conversation history' })
  @IsOptional()
  @IsArray()
  conversationHistory?: ChatMessage[];
}
