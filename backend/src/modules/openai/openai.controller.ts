import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import sharp from 'sharp';
import { OpenAIService } from './openai.service';
import { ChatDto } from './dto/chat.dto';

@ApiTags('OpenAI')
@Controller('openai')
export class OpenAIController {
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  constructor(private readonly openaiService: OpenAIService) {}

  @Post('analyze-image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analyze nutrition label or food image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // Store file in memory (not on disk)
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return callback(
            new BadRequestException('Only image files (jpg, jpeg, png, webp) are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async analyzeImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Optimize image: resize and compress
      const optimizedBuffer = await sharp(file.buffer)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Convert to base64
      const base64Image = optimizedBuffer.toString('base64');

      // Analyze with OpenAI Vision
      const result = await this.openaiService.analyzeNutritionImage(base64Image);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to analyze image: ${error.message}`);
    }
  }

  @Post('chat')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Chat with nutrition context' })
  async chat(@Body() chatDto: ChatDto) {
    try {
      const response = await this.openaiService.chatWithNutritionContext(
        chatDto.message,
        chatDto.nutritionContext,
        chatDto.conversationHistory,
      );

      return {
        success: true,
        response,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to get chat response: ${error.message}`);
    }
  }
}
