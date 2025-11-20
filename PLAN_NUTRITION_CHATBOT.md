# Nutrition Chatbot Implementation Plan

## Project Overview

Build a chatbot feature that allows users to:
1. Upload images of food dishes or nutrition labels
2. Extract text from nutrition labels using OCR (OpenAI Vision API)
3. Ask questions about nutritional content
4. Get answers based on FDA Nutrition Facts Label standards

## Tech Stack

- **Backend:** NestJS + TypeScript + Prisma + PostgreSQL
- **Frontend:** React + Vite + TypeScript + i18n
- **AI/ML:** OpenAI API (Vision API for OCR, GPT for chat)
- **Storage:** Local file system or cloud storage (AWS S3/Cloudinary)
- **Image Processing:** Sharp (optional, for optimization)

---

## Phase 1: Backend Implementation

### 1.1 Database Schema (Prisma)

```prisma
model Conversation {
  id          String    @id @default(uuid())
  userId      String?   // Optional: if you have user auth
  title       String?   // Auto-generated from first message
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  messages    Message[]

  @@map("conversations")
}

model Message {
  id             String       @id @default(uuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  role           MessageRole  // 'user' | 'assistant' | 'system'
  content        String       @db.Text
  imageUrl       String?      // If message contains an image
  ocrText        String?      @db.Text // Extracted text from image
  nutritionData  Json?        // Parsed nutrition data
  createdAt      DateTime     @default(now())

  @@map("messages")
  @@index([conversationId])
}

enum MessageRole {
  user
  assistant
  system
}

model UploadedImage {
  id           String   @id @default(uuid())
  originalName String
  filename     String   @unique
  mimetype     String
  size         Int
  path         String
  url          String
  ocrText      String?  @db.Text
  createdAt    DateTime @default(now())

  @@map("uploaded_images")
}
```

### 1.2 Backend Modules Structure

```
src/
├── modules/
│   ├── nutrition-chat/
│   │   ├── dto/
│   │   │   ├── create-conversation.dto.ts
│   │   │   ├── send-message.dto.ts
│   │   │   └── upload-image.dto.ts
│   │   ├── entities/
│   │   │   ├── conversation.entity.ts
│   │   │   └── message.entity.ts
│   │   ├── nutrition-chat.controller.ts
│   │   ├── nutrition-chat.service.ts
│   │   ├── nutrition-chat.module.ts
│   │   └── interfaces/
│   │       └── nutrition-data.interface.ts
│   ├── openai/
│   │   ├── openai.service.ts
│   │   ├── openai.module.ts
│   │   └── interfaces/
│   │       ├── vision-response.interface.ts
│   │       └── chat-response.interface.ts
│   └── file-upload/
│       ├── file-upload.service.ts
│       ├── file-upload.module.ts
│       └── interceptors/
│           └── file-validation.interceptor.ts
```

### 1.3 API Endpoints

#### Conversations
- `POST /api/nutrition-chat/conversations` - Create new conversation
- `GET /api/nutrition-chat/conversations` - List all conversations
- `GET /api/nutrition-chat/conversations/:id` - Get conversation with messages
- `DELETE /api/nutrition-chat/conversations/:id` - Delete conversation

#### Messages
- `POST /api/nutrition-chat/conversations/:id/messages` - Send text message
- `POST /api/nutrition-chat/conversations/:id/upload` - Upload image and analyze
- `GET /api/nutrition-chat/conversations/:id/messages` - Get conversation history

#### Image Processing
- `POST /api/nutrition-chat/analyze-image` - Standalone image analysis (OCR + nutrition extraction)

### 1.4 OpenAI Service Implementation

```typescript
// openai.service.ts - Key methods

export class OpenAIService {

  // Vision API for OCR and image analysis
  async analyzeNutritionLabel(imageUrl: string): Promise<NutritionData> {
    // Use GPT-4 Vision to:
    // 1. Detect if image contains nutrition label
    // 2. Extract all text (OCR)
    // 3. Parse nutritional information
    // 4. Structure data according to FDA standards
  }

  // Vision API for food recognition
  async recognizeFood(imageUrl: string): Promise<FoodRecognition> {
    // Use GPT-4 Vision to:
    // 1. Identify the food/dish
    // 2. Estimate ingredients
    // 3. Provide general nutritional estimates
  }

  // Chat completion with context
  async chatWithNutritionContext(
    messages: ChatMessage[],
    nutritionData?: NutritionData
  ): Promise<string> {
    // Use GPT-4 to answer questions with:
    // 1. Conversation history
    // 2. Extracted nutrition data as context
    // 3. FDA nutrition label guidelines
  }
}
```

### 1.5 Key Backend Features

1. **File Upload Validation**
   - Max file size: 10MB
   - Allowed formats: jpg, jpeg, png, webp
   - Image optimization before storage

2. **OpenAI Integration**
   - Vision API for image analysis
   - GPT-4 for intelligent responses
   - Structured prompts for nutrition extraction
   - Error handling and retry logic

3. **Nutrition Data Parser**
   - Extract serving size
   - Extract calories
   - Extract macronutrients (protein, carbs, fat)
   - Extract vitamins and minerals
   - Calculate % Daily Values
   - Validate against FDA standards

4. **System Prompts**
   ```
   You are a nutrition expert assistant. You help users understand
   nutrition facts labels according to FDA standards. You have access
   to extracted nutrition data from food labels. Provide accurate,
   helpful answers about:
   - Serving sizes and servings per container
   - Calorie content
   - Nutrient amounts and % Daily Values
   - Health implications
   - Dietary recommendations

   Always cite the nutrition facts label data when answering.
   ```

---

## Phase 2: Frontend Implementation

### 2.1 Frontend Structure

```
src/
├── pages/
│   └── NutritionChatPage/
│       ├── NutritionChatPage.tsx
│       └── NutritionChatPage.test.tsx
├── components/
│   └── nutrition-chat/
│       ├── ChatInterface/
│       │   ├── ChatInterface.tsx
│       │   └── ChatInterface.test.tsx
│       ├── MessageList/
│       │   ├── MessageList.tsx
│       │   ├── MessageBubble.tsx
│       │   └── ImageMessage.tsx
│       ├── ChatInput/
│       │   ├── ChatInput.tsx
│       │   └── ImageUpload.tsx
│       ├── NutritionCard/
│       │   ├── NutritionCard.tsx
│       │   └── NutritionFactsDisplay.tsx
│       └── ConversationSidebar/
│           ├── ConversationSidebar.tsx
│           └── ConversationItem.tsx
├── hooks/
│   ├── useChat.ts
│   ├── useImageUpload.ts
│   └── useConversations.ts
├── services/
│   └── nutrition-chat.service.ts
├── store/
│   └── chat-store.ts (Zustand)
└── types/
    ├── chat.types.ts
    └── nutrition.types.ts
```

### 2.2 Key Components

#### 2.2.1 NutritionChatPage
```typescript
// Main page component
- Layout with sidebar (conversation list) and main chat area
- Manage current conversation
- Handle routing/navigation
```

#### 2.2.2 ChatInterface
```typescript
// Main chat interface
- Display message history
- Handle message sending
- Display typing indicators
- Show nutrition cards when available
```

#### 2.2.3 ImageUpload
```typescript
// Image upload component
- Drag & drop support
- Preview before upload
- Upload progress indicator
- Error handling
- Image validation (size, format)
```

#### 2.2.4 NutritionFactsDisplay
```typescript
// Display extracted nutrition data in FDA format
- Serving size
- Calories
- Nutrients table
- % Daily Values
- Visual indicators (color coding)
```

### 2.3 State Management (Zustand)

```typescript
interface ChatStore {
  // Conversations
  conversations: Conversation[];
  currentConversation: Conversation | null;

  // Messages
  messages: Message[];
  isLoading: boolean;
  error: string | null;

  // Actions
  createConversation: () => Promise<void>;
  loadConversations: () => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  uploadImage: (file: File) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
}
```

### 2.4 API Service

```typescript
// nutrition-chat.service.ts

export const nutritionChatService = {
  // Conversations
  getConversations(): Promise<Conversation[]>,
  getConversation(id: string): Promise<Conversation>,
  createConversation(): Promise<Conversation>,
  deleteConversation(id: string): Promise<void>,

  // Messages
  sendMessage(conversationId: string, content: string): Promise<Message>,
  uploadImage(conversationId: string, file: File): Promise<Message>,

  // Image analysis
  analyzeImage(file: File): Promise<NutritionData>,
};
```

### 2.5 i18n Keys (English/Vietnamese)

```json
{
  "nutrition_chat": {
    "title": "Nutrition Assistant",
    "new_conversation": "New Conversation",
    "upload_image": "Upload Image",
    "placeholder": "Ask about nutrition...",
    "analyzing": "Analyzing image...",
    "upload": {
      "drag_drop": "Drag & drop an image here",
      "or": "or",
      "click_to_upload": "Click to upload",
      "supported_formats": "Supported: JPG, PNG, WEBP (max 10MB)"
    },
    "nutrition_facts": {
      "title": "Nutrition Facts",
      "serving_size": "Serving Size",
      "calories": "Calories",
      "total_fat": "Total Fat",
      "saturated_fat": "Saturated Fat",
      "trans_fat": "Trans Fat",
      "cholesterol": "Cholesterol",
      "sodium": "Sodium",
      "total_carbs": "Total Carbohydrates",
      "dietary_fiber": "Dietary Fiber",
      "total_sugars": "Total Sugars",
      "protein": "Protein",
      "daily_value": "% Daily Value"
    },
    "errors": {
      "upload_failed": "Failed to upload image",
      "analysis_failed": "Failed to analyze image",
      "send_failed": "Failed to send message",
      "invalid_file": "Invalid file format",
      "file_too_large": "File size exceeds 10MB"
    }
  }
}
```

---

## Phase 3: Implementation Steps

### Step 1: Backend Setup (2-3 days)

1. **Database Migration**
   ```bash
   # Create migration
   - Add Conversation, Message, UploadedImage models
   - Run migration
   ```

2. **File Upload Module**
   - Install multer for NestJS
   - Configure storage (local or cloud)
   - Add file validation
   - Implement upload service

3. **OpenAI Integration**
   - Install OpenAI SDK
   - Create OpenAI service
   - Implement Vision API integration
   - Implement Chat Completion API
   - Add error handling and retry logic

4. **Nutrition Chat Module**
   - Create DTOs for validation
   - Implement conversation CRUD
   - Implement message handling
   - Add nutrition data parser
   - Write unit tests

### Step 2: Frontend Setup (2-3 days)

1. **Create Base Components**
   - NutritionChatPage layout
   - ChatInterface component
   - MessageList and MessageBubble
   - ChatInput component

2. **Image Upload**
   - ImageUpload component with drag & drop
   - File validation
   - Preview functionality
   - Upload progress

3. **State Management**
   - Setup Zustand store
   - Create custom hooks
   - API service layer

4. **Add i18n**
   - Translation keys (en/vi)
   - All text using i18n

### Step 3: Integration (1-2 days)

1. **Connect Frontend to Backend**
   - API integration
   - Error handling
   - Loading states

2. **Real-time Features**
   - Streaming responses (optional)
   - Optimistic updates

3. **Testing**
   - Component tests
   - Integration tests
   - E2E testing

### Step 4: Polish & Optimization (1 day)

1. **UI/UX Improvements**
   - Smooth animations
   - Better error messages
   - Responsive design

2. **Performance**
   - Image optimization
   - Lazy loading
   - Caching

3. **Accessibility**
   - ARIA labels
   - Keyboard navigation

---

## Phase 4: Technical Considerations

### 4.1 OpenAI API Usage

**Vision API (GPT-4 Vision)**
```typescript
// Example prompt for nutrition label extraction
const prompt = `
Analyze this image and extract all nutrition information.
If this is a nutrition facts label, extract:
1. Serving size and servings per container
2. Calories per serving
3. All nutrients with amounts and % Daily Values
4. Any allergen information

If this is a food dish without a label, identify the food and
provide estimated nutritional information.

Return the data in JSON format following FDA nutrition label standards.
`;

const response = await openai.chat.completions.create({
  model: "gpt-4-vision-preview",
  messages: [{
    role: "user",
    content: [
      { type: "text", text: prompt },
      { type: "image_url", image_url: { url: imageUrl } }
    ]
  }],
  max_tokens: 1000
});
```

**Chat Completion with Context**
```typescript
const systemPrompt = `
You are a nutrition expert assistant helping users understand
nutrition facts labels according to FDA standards.

Nutrition data context:
${JSON.stringify(nutritionData, null, 2)}

Answer questions accurately, cite the nutrition facts when relevant,
and provide helpful dietary advice.
`;
```

### 4.2 Error Handling

1. **OpenAI API Errors**
   - Rate limiting
   - Token limits
   - API downtime
   - Invalid responses

2. **File Upload Errors**
   - File size exceeded
   - Invalid format
   - Storage failures

3. **Image Analysis Failures**
   - No nutrition label detected
   - Blurry/unreadable image
   - Partial data extraction

### 4.3 Cost Optimization

1. **Image Optimization**
   - Resize images before sending to OpenAI
   - Compress without losing readability
   - Cache OCR results

2. **API Usage**
   - Use GPT-4-turbo for chat (cheaper)
   - Use GPT-4-vision only for image analysis
   - Implement response caching
   - Rate limiting per user

3. **Storage**
   - Delete old images periodically
   - Compress stored images
   - Consider CDN for serving images

### 4.4 Security

1. **File Upload Security**
   - Validate file types (magic numbers, not just extensions)
   - Scan for malware
   - Limit file size
   - Sanitize filenames

2. **API Security**
   - Store OpenAI API key in environment variables
   - Implement rate limiting
   - Add authentication for production
   - Validate all inputs

3. **Data Privacy**
   - Don't store sensitive health information
   - Add user consent for image processing
   - GDPR compliance
   - Allow users to delete conversations

---

## Phase 5: Testing Strategy

### Backend Tests
```typescript
// nutrition-chat.service.spec.ts
- Test conversation creation
- Test message sending
- Test image upload
- Test OpenAI service integration (mocked)
- Test nutrition data parsing

// openai.service.spec.ts
- Test Vision API integration
- Test chat completion
- Test error handling
- Test retry logic
```

### Frontend Tests
```typescript
// ChatInterface.test.tsx
- Test message rendering
- Test message sending
- Test image upload UI
- Test error states

// useChat.test.ts
- Test state management
- Test API calls
- Test optimistic updates
```

### E2E Tests
```typescript
- Upload image and verify OCR
- Ask questions and verify responses
- Create and delete conversations
- Error handling flows
```

---

## Phase 6: Deployment Considerations

### Environment Variables

**Backend (.env)**
```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL_VISION=gpt-4-vision-preview
OPENAI_MODEL_CHAT=gpt-4-turbo-preview
MAX_FILE_SIZE=10485760  # 10MB
UPLOAD_DIR=./uploads
```

**Frontend (.env)**
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MAX_IMAGE_SIZE=10485760
```

### Monitoring

1. **API Usage Tracking**
   - OpenAI token usage
   - API costs
   - Rate limiting metrics

2. **Performance Monitoring**
   - Response times
   - Error rates
   - Image processing times

3. **User Metrics**
   - Conversations created
   - Images uploaded
   - Most asked questions

---

## Estimated Timeline

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Backend setup & OpenAI integration | 2-3 days |
| 2 | Frontend components & UI | 2-3 days |
| 3 | Integration & testing | 1-2 days |
| 4 | Polish & optimization | 1 day |
| **Total** | **Full feature** | **6-9 days** |

---

## Success Metrics

1. **Functional**
   - ✅ Successfully upload and analyze nutrition label images
   - ✅ Extract nutrition data with >90% accuracy
   - ✅ Answer nutrition questions accurately
   - ✅ Support both English and Vietnamese

2. **Performance**
   - Image analysis < 10 seconds
   - Chat response < 3 seconds
   - Support 10+ conversations per user

3. **User Experience**
   - Intuitive chat interface
   - Clear error messages
   - Responsive design
   - i18n support

---

## Future Enhancements

1. **Advanced Features**
   - Meal tracking and calorie counting
   - Dietary goals and recommendations
   - Food comparison tool
   - Barcode scanning
   - Recipe suggestions

2. **AI Improvements**
   - Fine-tuned model for nutrition data
   - Multi-image support
   - Voice input/output
   - Meal photo analysis (estimate nutrition without labels)

3. **Integrations**
   - Fitness apps integration
   - Health records integration
   - Shopping list generation
   - Restaurant menu analysis

---

## References

- [FDA Nutrition Facts Label](https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label)
- [OpenAI Vision API Documentation](https://platform.openai.com/docs/guides/vision)
- [OpenAI Chat Completions API](https://platform.openai.com/docs/guides/text-generation)
- [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload)
- [React Dropzone](https://react-dropzone.js.org/)
