# Nutrition Chatbot - Simplified Implementation Plan

## Project Overview

Build a simple chatbot page that allows users to:
1. Upload an image of a food dish or nutrition label
2. Extract text from nutrition labels using OCR (OpenAI Vision API)
3. Ask questions about nutritional content
4. Chat history stored on client-side (localStorage)

**Key Simplifications:**
- ❌ No authentication
- ❌ No database (Prisma)
- ❌ No conversation persistence on server
- ✅ Stateless backend API
- ✅ Client-side state management (Zustand + localStorage)

---

## Architecture

### Backend (NestJS) - Stateless API

**Modules:**
- `openai` - OpenAI Vision + Chat integration
- `file-upload` - Temporary file handling

**No Database Required** - All data stored on client

### Frontend (React + Vite)

**State Management:**
- Zustand store
- localStorage for persistence
- Session-based chat (cleared on page refresh or manually)

---

## Phase 1: Backend Implementation (1 day)

### 1.1 Backend Structure (Simplified)

```
src/
├── modules/
│   ├── openai/
│   │   ├── dto/
│   │   │   ├── analyze-image.dto.ts
│   │   │   └── chat.dto.ts
│   │   ├── interfaces/
│   │   │   ├── nutrition-data.interface.ts
│   │   │   └── vision-response.interface.ts
│   │   ├── openai.controller.ts
│   │   ├── openai.service.ts
│   │   └── openai.module.ts
│   └── file-upload/
│       ├── file-upload.service.ts
│       └── file-upload.module.ts
```

### 1.2 API Endpoints (Stateless)

```typescript
// All endpoints are stateless - no conversation persistence

POST /api/openai/analyze-image
- Upload image (multipart/form-data)
- Returns: { ocrText, nutritionData, foodRecognition }

POST /api/openai/chat
- Body: { message, nutritionContext?, conversationHistory[] }
- Returns: { response, tokensUsed }
```

### 1.3 OpenAI Service

```typescript
export class OpenAIService {
  // Analyze nutrition label or food image
  async analyzeImage(imageBuffer: Buffer): Promise<{
    ocrText: string;
    nutritionData: NutritionData | null;
    foodRecognition: string;
  }> {
    // Use GPT-4 Vision to extract nutrition info
  }

  // Chat with nutrition context
  async chat(
    message: string,
    nutritionContext?: NutritionData,
    conversationHistory?: ChatMessage[]
  ): Promise<string> {
    // Use GPT-4 for responses with context
  }
}
```

### 1.4 File Upload Service

```typescript
export class FileUploadService {
  // Process uploaded image (no storage, process in memory)
  async processImage(file: Express.Multer.File): Promise<Buffer> {
    // Validate file
    // Optimize with Sharp (resize, compress)
    // Return buffer for OpenAI API
    // Don't save to disk
  }
}
```

### 1.5 DTOs

```typescript
// analyze-image.dto.ts
export class AnalyzeImageDto {
  @IsNotEmpty()
  file: Express.Multer.File;
}

// chat.dto.ts
export class ChatDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional()
  nutritionContext?: NutritionData;

  @IsOptional()
  @IsArray()
  conversationHistory?: ChatMessage[];
}

// Interfaces
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
  protein?: string;
  vitamins?: Record<string, string>;
  minerals?: Record<string, string>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
```

---

## Phase 2: Frontend Implementation (1-2 days)

### 2.1 Frontend Structure

```
src/
├── pages/
│   └── NutritionChatPage.tsx
├── components/
│   └── nutrition-chat/
│       ├── ChatInterface.tsx
│       ├── ChatInput.tsx
│       ├── MessageList.tsx
│       ├── ImageUpload.tsx
│       └── NutritionCard.tsx
├── hooks/
│   ├── useChat.ts
│   └── useImageUpload.ts
├── services/
│   └── openai-api.service.ts
├── store/
│   └── nutrition-chat-store.ts
└── types/
    └── nutrition.types.ts
```

### 2.2 State Management (Zustand + localStorage)

```typescript
interface NutritionChatStore {
  // Current session data
  messages: Message[];
  currentImage: string | null; // base64 or URL
  nutritionData: NutritionData | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  uploadImage: (file: File) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;

  // localStorage persistence
  loadFromStorage: () => void;
  saveToStorage: () => void;
}

// Auto-save to localStorage on state changes
```

### 2.3 Components

#### NutritionChatPage
```typescript
// Main page - simple layout
- ImageUpload area (if no image uploaded)
- ChatInterface (if image uploaded)
- NutritionCard (display extracted data)
- Clear/Reset button
```

#### ImageUpload
```typescript
// Drag & drop or click to upload
- Preview uploaded image
- "Analyze" button
- Loading state during analysis
```

#### ChatInterface
```typescript
// Simple chat UI
- MessageList (scrollable)
- ChatInput (text input + send button)
- Display nutrition context in sidebar/header
```

#### NutritionCard
```typescript
// Display extracted nutrition data in FDA format
- Collapsible card
- Color-coded values
- Visual progress bars for % Daily Value
```

### 2.4 localStorage Schema

```typescript
interface StoredChat {
  sessionId: string;
  timestamp: string;
  image: string; // base64
  nutritionData: NutritionData | null;
  messages: Message[];
}

// Store in localStorage as:
localStorage.setItem('nutrition-chat-session', JSON.stringify(data));
```

### 2.5 API Service

```typescript
// openai-api.service.ts
export const openaiApi = {
  async analyzeImage(file: File): Promise<{
    ocrText: string;
    nutritionData: NutritionData | null;
    foodRecognition: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/openai/analyze-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  },

  async chat(
    message: string,
    nutritionContext?: NutritionData,
    conversationHistory?: ChatMessage[]
  ): Promise<string> {
    const response = await api.post('/openai/chat', {
      message,
      nutritionContext,
      conversationHistory,
    });

    return response.data.response;
  },
};
```

---

## Phase 3: Implementation Steps

### Step 1: Backend (Half day)

1. **Create OpenAI Module**
   ```bash
   cd backend
   # Create openai.service.ts with Vision + Chat
   # Create openai.controller.ts with 2 endpoints
   # Create DTOs for validation
   # No database, no Prisma needed
   ```

2. **File Upload**
   ```bash
   # Configure multer for memory storage
   # Add Sharp for image optimization
   # Validate file types and sizes
   ```

3. **Environment Setup**
   ```bash
   # Add OPENAI_API_KEY to .env
   # Configure CORS for frontend
   ```

### Step 2: Frontend (1 day)

1. **Create Components**
   ```bash
   cd frontend
   # NutritionChatPage layout
   # ImageUpload with drag & drop
   # ChatInterface components
   # NutritionCard display
   ```

2. **State Management**
   ```bash
   # Zustand store setup
   # localStorage persistence
   # API integration
   ```

3. **i18n**
   ```bash
   # Add translation keys (en/vi)
   # All text using i18n
   ```

### Step 3: Testing (Half day)

1. **Integration Testing**
   - Upload image flow
   - OCR extraction
   - Chat functionality
   - localStorage persistence

2. **Error Handling**
   - Network errors
   - OpenAI API errors
   - Invalid files
   - Large files

---

## Technical Implementation Details

### Backend: OpenAI Service Implementation

```typescript
import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async analyzeNutritionImage(imageBase64: string): Promise<{
    ocrText: string;
    nutritionData: NutritionData | null;
    foodRecognition: string;
  }> {
    const prompt = `
Analyze this image carefully.

If this is a nutrition facts label:
1. Extract ALL text (OCR)
2. Identify and extract nutrition information in this JSON format:
{
  "servingSize": "amount",
  "servingsPerContainer": number,
  "calories": number,
  "totalFat": "amount with unit",
  "saturatedFat": "amount",
  "transFat": "amount",
  "cholesterol": "amount",
  "sodium": "amount",
  "totalCarbohydrates": "amount",
  "dietaryFiber": "amount",
  "totalSugars": "amount",
  "protein": "amount",
  "vitamins": {"vitaminName": "amount"},
  "minerals": {"mineralName": "amount"}
}

If this is a food dish without a label:
1. Identify the food/dish
2. Provide estimated nutritional information based on typical values
3. Note that these are estimates

Return a JSON response with:
{
  "isNutritionLabel": boolean,
  "ocrText": "extracted text if label",
  "nutritionData": {...nutrition info...},
  "foodRecognition": "description of food if not a label"
}
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
    });

    const result = JSON.parse(response.choices[0].message.content);

    return {
      ocrText: result.ocrText || '',
      nutritionData: result.nutritionData || null,
      foodRecognition: result.foodRecognition || '',
    };
  }

  async chatWithNutritionContext(
    message: string,
    nutritionContext?: NutritionData,
    conversationHistory?: ChatMessage[],
  ): Promise<string> {
    const systemPrompt = `
You are a nutrition expert assistant. You help users understand nutrition facts labels according to FDA standards.

${nutritionContext ? `Current Nutrition Data:\n${JSON.stringify(nutritionContext, null, 2)}` : ''}

Guidelines:
- Provide accurate, helpful answers about nutrition
- Reference the nutrition facts when available
- Explain % Daily Values based on 2,000 calorie diet
- Offer dietary advice when appropriate
- Be concise but informative
`;

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...(conversationHistory || []),
      { role: 'user', content: message },
    ];

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  }
}
```

### Backend: Controller

```typescript
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OpenAIService } from './openai.service';
import { ChatDto } from './dto/chat.dto';
import * as sharp from 'sharp';

@Controller('openai')
export class OpenAIController {
  constructor(private readonly openaiService: OpenAIService) {}

  @Post('analyze-image')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeImage(@UploadedFile() file: Express.Multer.File) {
    // Optimize image
    const optimizedBuffer = await sharp(file.buffer)
      .resize(1024, 1024, { fit: 'inside' })
      .jpeg({ quality: 85 })
      .toBuffer();

    const base64Image = optimizedBuffer.toString('base64');

    const result = await this.openaiService.analyzeNutritionImage(base64Image);

    return result;
  }

  @Post('chat')
  async chat(@Body() chatDto: ChatDto) {
    const response = await this.openaiService.chatWithNutritionContext(
      chatDto.message,
      chatDto.nutritionContext,
      chatDto.conversationHistory,
    );

    return { response };
  }
}
```

### Frontend: Zustand Store

```typescript
import create from 'zustand';
import { persist } from 'zustand/middleware';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface NutritionChatStore {
  // State
  messages: Message[];
  currentImage: string | null;
  nutritionData: NutritionData | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  uploadImage: (file: File) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

export const useNutritionChatStore = create<NutritionChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      currentImage: null,
      nutritionData: null,
      isLoading: false,
      error: null,

      uploadImage: async (file: File) => {
        set({ isLoading: true, error: null });

        try {
          // Convert to base64 for display
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });

          const imageBase64 = await base64Promise;

          // Call API
          const result = await openaiApi.analyzeImage(file);

          set({
            currentImage: imageBase64,
            nutritionData: result.nutritionData,
            isLoading: false,
          });

          // Add initial message
          const assistantMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: result.foodRecognition ||
                     'I\'ve analyzed the nutrition label. Ask me anything about it!',
            timestamp: new Date().toISOString(),
          };

          set((state) => ({
            messages: [...state.messages, assistantMessage],
          }));
        } catch (error) {
          set({
            error: 'Failed to analyze image. Please try again.',
            isLoading: false
          });
        }
      },

      sendMessage: async (content: string) => {
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, userMessage],
          isLoading: true,
        }));

        try {
          const { messages, nutritionData } = get();

          const response = await openaiApi.chat(
            content,
            nutritionData,
            messages
          );

          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response,
            timestamp: new Date().toISOString(),
          };

          set((state) => ({
            messages: [...state.messages, assistantMessage],
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: 'Failed to send message. Please try again.',
            isLoading: false
          });
        }
      },

      clearChat: () => {
        set({
          messages: [],
          currentImage: null,
          nutritionData: null,
          error: null,
        });
      },
    }),
    {
      name: 'nutrition-chat-storage',
    }
  )
);
```

---

## Estimated Timeline (SIMPLIFIED)

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Backend API (stateless) | 0.5 day |
| 2 | Frontend UI + State | 1 day |
| 3 | Integration & Testing | 0.5 day |
| **Total** | **Complete Feature** | **2 days** |

---

## Cost Optimization

Since there's no database caching:

1. **Minimize OpenAI Calls**
   - Cache nutrition data on client after first analysis
   - Don't re-analyze same image
   - Optimize image size before upload

2. **Image Optimization**
   - Resize to max 1024x1024
   - Compress to 85% quality
   - Convert to JPEG

3. **Rate Limiting**
   - Implement on backend
   - Prevent abuse

---

## Environment Variables

**Backend**
```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL_VISION=gpt-4-vision-preview
OPENAI_MODEL_CHAT=gpt-4-turbo-preview
MAX_FILE_SIZE=10485760
```

**Frontend**
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MAX_IMAGE_SIZE=10485760
```

---

## Success Criteria

1. ✅ Upload image and extract nutrition data
2. ✅ Ask questions and get accurate responses
3. ✅ Chat history persists in browser (localStorage)
4. ✅ No authentication required
5. ✅ No database required
6. ✅ Stateless backend API
7. ✅ Fully functional in 2 days

---

## Simplified Architecture Diagram

```
┌─────────────────────────────────────────┐
│           Frontend (React)              │
│  ┌───────────────────────────────────┐  │
│  │  NutritionChatPage                │  │
│  │  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │ImageUpload  │  │ChatInterface│ │  │
│  │  └─────────────┘  └─────────────┘ │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  NutritionCard (FDA format) │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│           │                              │
│           │  Zustand Store               │
│           │  + localStorage              │
└───────────┼──────────────────────────────┘
            │
            │ HTTP API
            ▼
┌─────────────────────────────────────────┐
│      Backend (NestJS) - Stateless       │
│  ┌───────────────────────────────────┐  │
│  │  POST /api/openai/analyze-image  │  │
│  │  (upload → optimize → Vision API) │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │  POST /api/openai/chat            │  │
│  │  (message + context → GPT-4)      │  │
│  └───────────────────────────────────┘  │
└─────────────┼───────────────────────────┘
              │
              │ OpenAI API
              ▼
       ┌──────────────┐
       │   OpenAI     │
       │  GPT-4 Vision│
       │  GPT-4 Turbo │
       └──────────────┘
```

---

## Key Differences from Original Plan

| Aspect | Original Plan | Simplified Plan |
|--------|--------------|-----------------|
| Database | ✅ Prisma + PostgreSQL | ❌ No database |
| Authentication | ✅ Optional | ❌ None |
| Backend | Stateful with persistence | ✅ Stateless API only |
| Storage | ✅ Server-side | ✅ Client-side (localStorage) |
| Timeline | 6-9 days | ✅ 2 days |
| Complexity | High | ✅ Low |

---

## Next Steps to Implement

1. **Remove Prisma** (not needed)
2. **Create OpenAI module** with 2 endpoints
3. **Create Frontend components**
4. **Connect everything**
5. **Test and polish**

Ready to start implementation!
