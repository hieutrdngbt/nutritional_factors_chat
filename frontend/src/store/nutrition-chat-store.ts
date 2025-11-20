import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ChatSession,
  ChatMessage,
  NutritionData,
  ImageAnalysisResult,
} from '../types/nutrition.types';
import { openAIApiService } from '../services/openai-api.service';

interface NutritionChatState {
  // State
  session: ChatSession | null;
  isAnalyzing: boolean;
  isSending: boolean;
  error: string | null;

  // Actions
  uploadAndAnalyzeImage: (file: File) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  clearSession: () => void;
  clearError: () => void;
}

const createNewSession = (): ChatSession => ({
  id: `session-${Date.now()}`,
  nutritionData: null,
  imageAnalysis: null,
  messages: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export const useNutritionChatStore = create<NutritionChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      session: null,
      isAnalyzing: false,
      isSending: false,
      error: null,

      // Upload and analyze image
      uploadAndAnalyzeImage: async (file: File) => {
        set({ isAnalyzing: true, error: null });

        try {
          const response = await openAIApiService.analyzeImage(file);
          const { data } = response;

          // Create new session with analysis results
          const newSession: ChatSession = {
            id: `session-${Date.now()}`,
            nutritionData: data.nutritionData,
            imageAnalysis: data,
            messages: [
              {
                role: 'assistant',
                content: data.isNutritionLabel
                  ? `I've analyzed the nutrition label. ${data.foodRecognition || 'Ready to answer your questions!'}`
                  : `I've identified this as: ${data.foodRecognition}. I can provide estimated nutritional information. What would you like to know?`,
                timestamp: Date.now(),
              },
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          set({ session: newSession, isAnalyzing: false });
        } catch (error) {
          set({
            isAnalyzing: false,
            error: error instanceof Error ? error.message : 'Failed to analyze image',
          });
          throw error;
        }
      },

      // Send chat message
      sendMessage: async (message: string) => {
        const { session } = get();

        if (!session) {
          set({ error: 'No active session. Please upload an image first.' });
          return;
        }

        // Add user message immediately
        const userMessage: ChatMessage = {
          role: 'user',
          content: message,
          timestamp: Date.now(),
        };

        const updatedMessages = [...session.messages, userMessage];

        set({
          session: {
            ...session,
            messages: updatedMessages,
            updatedAt: Date.now(),
          },
          isSending: true,
          error: null,
        });

        try {
          // Send to API with context
          const response = await openAIApiService.chat(
            message,
            session.nutritionData || undefined,
            updatedMessages,
          );

          // Add assistant response
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: response.response,
            timestamp: Date.now(),
          };

          set((state) => ({
            session: state.session
              ? {
                  ...state.session,
                  messages: [...state.session.messages, assistantMessage],
                  updatedAt: Date.now(),
                }
              : null,
            isSending: false,
          }));
        } catch (error) {
          set({
            isSending: false,
            error: error instanceof Error ? error.message : 'Failed to send message',
          });
          throw error;
        }
      },

      // Clear current session
      clearSession: () => {
        set({
          session: null,
          error: null,
          isAnalyzing: false,
          isSending: false,
        });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'nutrition-chat-storage',
      partialize: (state) => ({
        session: state.session,
      }),
    },
  ),
);
